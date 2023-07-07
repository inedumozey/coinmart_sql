import React from 'react'
import HistoryData from './InvestmentHxData'

export default function InvestmentHx({ data, selectedUser }) {
    return <HistoryData selectedUser={selectedUser} data={data} />
}
