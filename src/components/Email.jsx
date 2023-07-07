import React, { useContext } from 'react'
import { Context } from '../context/Context'

export default function Email() {
    const { contact } = useContext(Context)

    return <a href={`mailto:${contact.email}`}>{contact.email}</a>
}
