import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components';
import Modal from '../../../Modal';
import { Context } from '../../../../context/Context';
import Cookies from 'js-cookie';
import apiClass from '../../../../utils/api';
import Spinner_ from '../../../spinner/Spinner';
import Btn from '../../../Btn/Btn';

const api = new apiClass()

export default function Add_Update_Plans() {
    const [restrict, setRestrict] = useState(false)
    const { investment } = useContext(Context);

    const {
        setPlans,
        postingPlan,
        setPostingPlan,
        updatingPlan,
        setUpdatingPlan,
        refreshingPlans,
        setRefreshingPlans,
        operationType,
        setOperationType,
        selectedPlan,
    } = investment.plans;

    const initialState = {
        type: operationType === 'add-plan' ? '' : selectedPlan.type,
        minAmount: operationType === 'add-plan' ? '' : selectedPlan.minAmount,
        maxAmount: operationType === 'add-plan' ? '' : selectedPlan.maxAmount,
        lifespan: operationType === 'add-plan' ? '' : selectedPlan.lifespan,
        point: operationType === 'add-plan' ? '' : selectedPlan.point,
        returnPercentage: operationType === 'add-plan' ? '' : selectedPlan.returnPercentage,
    }

    const [inp, setInp] = useState(initialState)

    useEffect(() => {
        (!inp.type || !inp.minAmount || !inp.maxAmount || !inp.lifespan || !inp.point || !inp.returnPercentage) ? setRestrict(true) : setRestrict(false)
    }, [inp.type, inp.minAmount, inp.maxAmount, inp.lifespan, inp.point, inp.returnPercentage])

    const submitForm = (e) => {

        // if the operation type is plan-add, perform add plan opeartion, otherwise, perform plan update operation
        e.preventDefault();
        operationType === 'add-plan' ? setPostingPlan(true) : setUpdatingPlan(true)

        // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                operationType === 'add-plan' ? api.postPlan(inp, setPostingPlan, setPlans, setRefreshingPlans) : api.updatePlan(inp, selectedPlan._id, setUpdatingPlan, setPlans, setRefreshingPlans)
            }, 2000);
        }
        else {
            operationType === 'add-plan' ? api.postPlan(inp, setPostingPlan, setPlans, setRefreshingPlans) : api.updatePlan(inp, selectedPlan._id, setUpdatingPlan, setPlans, setRefreshingPlans)
        }
    }

    return (
        <Form onSubmit={submitForm}>
            <InputWrapper>
                <label htmlFor="">Type:</label>
                <input
                    autoFocus
                    placeholder="Type"
                    value={inp.type || ''}
                    onChange={(e) => setInp({ ...inp, type: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label htmlFor="">Min Amount:</label>
                <input
                    type="number"
                    placeholder="Min Amount"
                    value={inp.minAmount || ''}
                    onChange={(e) => setInp({ ...inp, minAmount: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label htmlFor="">Max Amount:</label>
                <input
                    type="number"
                    placeholder="Max Amount"
                    value={inp.maxAmount || ''}
                    onChange={(e) => setInp({ ...inp, maxAmount: e.target.value })}
                />
            </InputWrapper>


            <InputWrapper>
                <label htmlFor="">Lifespan:</label>
                <input
                    type="number"
                    placeholder="Lifespan"
                    value={inp.lifespan || ''}
                    onChange={(e) => setInp({ ...inp, lifespan: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label htmlFor="">Return Percentage:</label>
                <input
                    type="number"
                    placeholder="Return Percentage"
                    value={inp.returnPercentage || ''}
                    onChange={(e) => setInp({ ...inp, returnPercentage: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label htmlFor="">Contest Point:</label>
                <input
                    type="number"
                    placeholder="Contest Point"
                    value={inp.point || ''}
                    onChange={(e) => setInp({ ...inp, point: e.target.value })}
                />
            </InputWrapper>

            <div className='text-center text-md-start mt- pt-2'>
                <Btn disabled={restrict} color="var(--blue)" link={false}>
                    {postingPlan || updatingPlan || refreshingPlans ? <Spinner_ size="sm" /> : operationType === 'add-plan' ? "Add Plan" : "Update Plan"}
                </Btn>
            </div>

        </Form>
    )
}


const InputWrapper = styled.div`
    width: 100%;
    min-height: 45px;
    margin-bottom: 15px;    
    font-size: .8rem;

    .tag {
        color: #c30;
        font-size: .7rem;
    }
    
    input {
        padding: 12px;
        height: 100%;
        width: 100%;
        border: 1px solid #ccc;
        display: block;
        font-size: .9rem;
        border-radius: 5px;

        &: focus{
            outline: none;
            border: 3px solid var(--blue);
        }
    } 
`

const Form = styled.form`
    width: 100%;
    padding: 10px;
`