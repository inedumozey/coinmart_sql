import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import { Context } from '../../../context/Context'
import apiClass from '../../../utils/api'
import Spinner_ from '../../spinner/Spinner'
import { Table } from '../../../styles/globalStyles'
import { useSnap } from '@mozeyinedu/hooks-lab';
import filter from "@mozeyinedu/filter";
import { Link } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';

const api = new apiClass()

export default function UserData() {
    const { snap } = useSnap(.5)
    const { config, admin, num } = useContext(Context);
    const [inp, setInp] = useState('')

    const [count, setCount] = useState(num);
    const [opening, setOpening] = useState(false);
    const [loadingToggleAdmin, setLoadingToggleAdmin] = useState(false);
    const [selectedData, setSelectedData] = useState('');

    const {
        setFetchingUsers_refresh,
        userData,
        setUserData,
        toggleBlockUserLoading,
        setToggleBockUserLoading,
        toggleMakeAdminLoading,
        setToggleMakeAdminLoading,
        deleteUserLoading,
        setDeleteUserLoading,
    } = admin.userMgt

    const [filteredData, setFilter] = useState(userData.data);

    useEffect(() => {
        const newData = filter({
            data: userData.data,
            keys: ["username", "email", 'role', "amount", "accountNumber", "_id"],
            input: inp
        })

        setFilter(newData)

    }, [inp, userData.data])

    const handleViewMore = () => {
        setOpening(true)

        setTimeout(() => {
            setOpening(false)
            setCount(prevState => prevState + num)
        }, 1000)
    }

    const handleToggleAdmin = (user) => {
        setSelectedData(user)

        setToggleMakeAdminLoading(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.toggleAdmin(user._id, setToggleMakeAdminLoading, setFetchingUsers_refresh, setUserData)
            }, 2000);
        }
        else {
            api.toggleAdmin(user._id, setToggleMakeAdminLoading, setFetchingUsers_refresh, setUserData)
        }
    }

    const handleToggleDeactivate = (user) => {
        setSelectedData(user)

        setToggleBockUserLoading(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.toggleDeactivate(user._id, setToggleBockUserLoading, setFetchingUsers_refresh, setUserData)
            }, 2000);
        }
        else {
            api.toggleDeactivate(user._id, setToggleBockUserLoading, setFetchingUsers_refresh, setUserData)
        }
    }

    const handleDelete = (user) => {
        setSelectedData(user)

        setDeleteUserLoading(true)
        const arr_id = [] // send array of selected ids to the backend using put request
        arr_id.push(user._id)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.deleteUser(arr_id, setDeleteUserLoading, setFetchingUsers_refresh, setUserData)
            }, 2000);
        }
        else {
            api.deleteUser(arr_id, setDeleteUserLoading, setFetchingUsers_refresh, setUserData)
        }
    }

    return (
        <Wrapper>
            <div className="header">
                <div className="stat-wrapper">
                    <div className="stat">
                        <div>Total Users: {userData.data.length}</div>
                        <div>
                            Admins: {(userData.data.filter(user => user.role?.toLowerCase() === 'admin')).length}
                        </div>
                        <div>
                            Supper Admins: {(userData.data.filter(user => user.isSupperAdmin)).length}
                        </div>
                        <div>
                            Investors: {(userData.data.filter(user => user.hasInvested)).length}
                        </div>
                        <div>
                            App Total Balance: {
                                (function () {
                                    const amountArr = userData.data.map(user => {
                                        return user.amount;
                                    })

                                    const sum = amountArr.reduce((a, b) => {
                                        return a + b
                                    }, 0)

                                    return sum;
                                }())
                            } {config.configData.currency}
                        </div>
                    </div>
                </div>
                <div className="search-wrapper">
                    <div className="search">
                        <input
                            placeholder='Search by Username, Email, Amount, or Account Number'
                            value={inp || ''}
                            onChange={(e) => setInp(e.target.value)}
                        />
                    </div>
                </div>

            </div>

            <Table>
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Member Since</th>
                            <th>View</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Profile</th>
                            <th>Role</th>
                            <th>Verified</th>
                            <th>Balance</th>
                            <th>Account No</th>
                            <th>Refcode</th>
                            <th>Referees</th>
                            <th>Country</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Investor</th>
                            <th>Deactivate</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.slice(0, count).map((data, i) => {
                            return (
                                <tr key={data._id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        {data.createdAt && new Date(data.createdAt).toLocaleString()}
                                    </td>
                                    <td
                                        {...snap()}
                                        style={{ color: 'var(--blue', userSelect: 'none' }}
                                    >
                                        <Link to={`/admin/users/${data._id}`}>View</Link>
                                    </td>
                                    <td>{data.email}</td>
                                    <td>{data.username}</td>
                                    <td>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                        }}>
                                            <img style={{ width: '100%', height: '100%', borderRadius: '50%' }} src={data.profilePicUrl} alt="" />
                                        </div>
                                    </td>
                                    <td
                                        {...snap()}
                                        onDoubleClick={loadingToggleAdmin ? () => { } : () => handleToggleAdmin(data)}
                                        style={
                                            (function () {
                                                if (data.role?.toLowerCase() === 'admin' && !data.isSupperAdmin) {
                                                    return { color: 'var(--blue)', userSelect: 'none' }
                                                }
                                                else if (data.role?.toLowerCase() === 'admin' && data.isSupperAdmin) {
                                                    return { color: 'red', userSelect: 'none' }
                                                }
                                                else {
                                                    return { color: 'inherit', userSelect: 'none' }
                                                }
                                            }())
                                        }
                                    >
                                        {
                                            toggleMakeAdminLoading && selectedData._id === data._id ?
                                                <div className="center"><Spinner_ size="sm" /></div> :
                                                (data.role?.toLowerCase() === 'admin' && data.isSupperAdmin) ? "SUPER ADMIN" : data.role?.toUpperCase()

                                        }
                                    </td>
                                    <td>{data.isVerified ? <VerifiedIcon style={{ color: 'blue' }} /> : 'Unverified'}</td>
                                    <td>{data.amount} {data.currency}</td>
                                    <td>{data.accountNumber}</td>
                                    <td>{data.referralCode}</td>
                                    <td>{data.referreeId ? data.referreeId.length : 0}</td>
                                    <td>{data.country}</td>
                                    <td>{data.phone}</td>
                                    <td>{data.address}</td>
                                    <td>{data.hasInvested ? 'True' : 'False'}</td>

                                    <td
                                        {...snap()}
                                        onDoubleClick={() => handleToggleDeactivate(data)}
                                        style={{ color: 'red', userSelect: 'none' }}
                                    >
                                        {toggleBlockUserLoading && selectedData._id === data._id ?
                                            <div className="center"><Spinner_ size="sm" /></div> :
                                            data.isBlocked ? 'Unblock' : 'Block'}
                                    </td>

                                    <td
                                        {...snap()}
                                        onDoubleClick={() => handleDelete(data)}
                                        style={{ color: 'red', userSelect: 'none' }}
                                    >
                                        {
                                            deleteUserLoading && selectedData._id === data._id ?
                                                <div className="center"><Spinner_ size="sm" /></div> :
                                                "Delete"
                                        }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Table>
            {
                count >= filteredData.length ? '' :

                    <ViewMore>

                        <div onClick={handleViewMore} className="more" {...snap()}>
                            {opening ? <div className='center'> <Spinner_ size="sm" /></div> : 'View more...'}
                        </div>
                    </ViewMore>
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    background: #fff;
    padding: 20px;
    box-shadow: 2px 2px 4px #ccc;

    .header {
        .search-wrapper {
            display: flex;
            justify-content: flex-end;
        }

        .search {
            display: inline-block;
            margin-bottom: 10px;
            width: 40%;
            max-width: 300px;
            min-width: 200px;
    
            input {
                padding: 6px;
                border-radius: 5px;
                width: 100%;
                border: 1px solid #ccc;
        
                &: focus {
                    outline: none;
                }
            }
        }
    }

`

const ViewMore = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;

    .more{
        user-select: none;
       
        -webkit-user-select: none;
        font-size: .7rem;
        cursor: pointer;
        border: 1px solid;
        border-radius: 5px;
        padding: 7px;

        &:hover{
            opacity: .3
        }
    }
`