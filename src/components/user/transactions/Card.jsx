import React from 'react'
import TransferCard from './TransferCard'
import DepositCard from './DepositCard'
import WithdrawalCard from './WithdrawalCard';


export default function Card({ data, profileData }) {

    return (
        (function () {
            if (data.transactionType?.toLowerCase() === 'transfer') {
                return <TransferCard data={data} profileData={profileData} />
            }
            else if (data.transactionType?.toLowerCase() === 'deposit') {
                return <DepositCard data={data} />
            }
            else if (data.transactionType?.toLowerCase() === 'withdrawal') {
                return <WithdrawalCard data={data} />
            }
            else {
                return ''
            }
        }())
    )
}


