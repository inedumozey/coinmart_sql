import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { Context } from '../../context/Context';
import apiClass from '../../utils/api';
import Btn from '../Btn/Btn';
import Spinner_ from '../spinner/Spinner';
import Skeleton from '../Skeleton';
import resolve from '../../utils/resolve';
import Modal from '../Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BuyPlan from './BuyPlan';

const api = new apiClass()

export default function InvestmentPlans() {
    const { investment, fetchDataErrorMsg, noDataMsg } = useContext(Context)
    const [load, setLoading] = useState(true);

    const {
        plans,
        setPlans,
        deletingPlan,
        setDeletingPlan,
        refreshingPlans,
        setRefreshingPlans,
        setOperationType,
        setSelectedPlan,
        setOpenAddPlanModal,
        fetchingPlans,
        fetchingPlansSuccess
    } = investment.plans;

    const {
        openInvestModal,
        setOpenInvestModal,
        selectedInvestingPlan,
        setSelectedInvestingPlan,
    } = investment.invest;


    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    const handleInvest = (plan) => {
        setSelectedInvestingPlan(plan);
        setOpenInvestModal(true)
    }

    const handleEdit = (plan) => {
        setSelectedPlan(plan)
        setOperationType('update-plan')
        setOpenAddPlanModal(true)
    }

    const handleDelete = (id) => {
        setDeletingPlan(true)

        // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.deletePlan(id, setDeletingPlan, setPlans, setRefreshingPlans)
            }, 1000);
        }
        else {
            api.deletePlan(id, setDeletingPlan, setPlans, setRefreshingPlans)
        }

    }

    return (
        <Wrapper>
            {
                load || fetchingPlans ?
                    [1, 2, 3]?.map((item, i) => {
                        return (
                            <Card key={i}>
                                <div className="header">
                                    <div style={{ background: '#fff', height: '60px' }} className="title">
                                        <Skeleton />
                                    </div>
                                    <div style={{ padding: '0' }} className="profit">
                                        <div style={{ width: '80px', height: '30px', margin: 'auto' }} className="value">
                                            <Skeleton />
                                        </div>
                                    </div>
                                </div>
                                <div className="body">
                                    <div style={{ width: '100px', height: '25px' }} className="lifespan">
                                        <Skeleton />
                                    </div>
                                    <div style={{ width: '100%', height: '15px' }} className="lifespan">
                                        <Skeleton />
                                    </div>
                                    <div style={{ width: '100%', height: '15px' }} className="lifespan">
                                        <Skeleton />
                                    </div>
                                    <div style={{ width: '60px', height: '15px' }} className="lifespan">
                                        <Skeleton />
                                    </div>
                                </div>
                                <div className="footer">
                                    <div style={{ width: '100px', height: '30px', margin: 'auto' }} className="value">
                                        <Skeleton />
                                    </div>
                                </div>
                            </Card>
                        )
                    }) :

                    !fetchingPlansSuccess ?
                        <div className="tag">{fetchDataErrorMsg}</div> :

                        plans?.length ?
                            plans?.map((plan, i) => {
                                return (
                                    <Card key={plan._id}>
                                        <div className="header">
                                            <div className="title">{plan.type?.toUpperCase()}</div>
                                            <div className="profit">
                                                <span className="value">{plan.returnPercentage}%</span> {""}
                                                <span>Profit</span>
                                            </div>
                                        </div>
                                        <div className="body">
                                            <div className="lifespan">{resolve.resolveSeconds(plan.lifespan)}</div>
                                            <div className="amount">Minimun Amount: {plan.minAmount} {" "} {plan.currency}</div>
                                            <div className="amount">Maximun Amount: {plan.maxAmount === 0 ? 'Unlimited' : `${plan.maxAmount} ${plan.currency}`}</div>
                                            <div className="amount">Point: {plan.point}</div>
                                        </div>
                                        <div className="footer">
                                            {/* add ediy button if role admin and extratoken exist in cookies */}
                                            {

                                                Cookies.get('role')?.toLowerCase() === "admin" && Cookies.get('extratoken') && Cookies.get('refreshtoken') ?
                                                    <div
                                                        className='action-btn edit'
                                                        color="var(--blue)"
                                                        onClick={() => handleEdit(plan)}
                                                    >
                                                        <EditIcon style={{ color: 'green' }} />
                                                    </div> : ''
                                            }

                                            <Btn
                                                color="var(--blue)"
                                                link={false}
                                                onClick={() => handleInvest(plan)}
                                            >
                                                Invest
                                            </Btn>

                                            {/* add delete button if role admin and extratoken exist in cookies */}
                                            {
                                                Cookies.get('role')?.toLowerCase() === "admin" && Cookies.get('extratoken') && Cookies.get('refreshtoken') ?
                                                    <div
                                                        className='action-btn delete'
                                                        color="var(--blue)"
                                                        onClick={() => handleDelete(plan._id)}
                                                    >
                                                        {deletingPlan || refreshingPlans ? <Spinner_ size='sm' /> : <DeleteForeverIcon style={{ color: 'red' }} />}
                                                    </div> : ''
                                            }

                                        </div>
                                    </Card>
                                )
                            }) :
                            <div className="tag">{noDataMsg}</div>
            }

            {/* open investing modal */}
            <Modal
                show={openInvestModal}
                onHide={setOpenInvestModal}
                title={selectedInvestingPlan.type}
            >
                <BuyPlan />
            </Modal>
        </Wrapper >
    )
}


const Wrapper = styled.div`
    margin: auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    transition: ${({ theme }) => theme.transition};

    padding: 20px ${({ theme }) => theme.lg_padding};
        @media (max-width: ${({ theme }) => theme.md_screen}){
            padding: 20px ${({ theme }) => theme.md_padding};
        }
        @media (max-width: ${({ theme }) => theme.sm_screen}){
            padding: 20px ${({ theme }) => theme.sm_padding};
        }

        .tag {
            font-size: .65rem;
            color: red;
        }
    }
`

const Card = styled.div`
    width: 200px;
    height: 300px;
    box-shadow: 2px 2px 4px #ccc, -2px -2px 4px #ccc;
    background: #fff;
    padding: 10px;
    margin: 10px;
    
    position: relative;

    @media (max-width: ${({ theme }) => theme.sm_screen}){
        width: 90%;
        padding: 5px;
    }

    .header {
        min-height: 100px;
        .title {
            background: var(--blue);
            font-weight: bold;
            text-align: center;
            padding: 10px;
            color: #fff;
            width: 100%;
        }
    
        .profit {
            padding: 10px 0;
            text-align: center;
            
            .value {
                color: var(--yellow);
                font-weight: bold;
                font-size: 1.5rem;
            }
        }
    }
    .footer {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;

        .action-btn {
            display: none;
        }
    }
    .body {
        height: calc(100% - 100px - 50px);
        display: flex;
        flex-direction: column;
        justify-content: center;

        .lifespan {
            padding: 5px 10px;
            font-weight: bold;
            font-size: 1.3rem;
        }

        .amount {
            padding: 3px 10px;
            font-size: .7rem;
            font-weight: 600;
        }
    }

    &:hover {
        .action-btn {
            display: block;
        }
    }
`