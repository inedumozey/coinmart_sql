import React, { useContext } from 'react'
import { Context } from '../context/Context'

export default function Phone() {
    const { contact } = useContext(Context)

    return <a href={`tel:+${contact.mobile}`}>{contact.mobile}</a>
}
