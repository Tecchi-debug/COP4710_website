import React, {useState} from 'react'

// File for any helper functions/ components needed for admin panel
export function setTypeHelper(event, setFunction) {
    const type = event.target.value;
    
    if (type === "") {
        return;
    } else {
        setFunction(type);
    }
}

export function AnnualRestaurantForm(props) {
    return (
        <>
            <form>
                <h3>Annual Restaurant Activity</h3>
            </form>
        </>
    )
}

export function AnnualCustomerForm(props) {
    return (
        <>
            <form>
                <h3>Annual Customer Purchase Form</h3>
            </form>
        </>
    )
}

export function AnnualFreePlateForm(props) {
    return (
        <>
            <form>
                <h3>Annual Free Plate Form</h3>
            </form>
        </>
    )
}

export function AnnualDonationReport(props) {
    return (
        <>
            <form>
                <h3>Year-end Donation Report</h3>
            </form>
        </>
    )
}

export function GetAllMembers(props) {
    return (
        <>
            <form>
                <h3>Get All Members</h3>
            </form>
        </>
    )
}

export function GetMemberByType(props) {
    return (
        <>
            <form>
                <h3>Get Members by Type</h3>
            </form>
        </>
    )
}

export function GetMemberByEmail(props) {
    return (
        <>
            <form>
                <h3>Find Member by Email</h3>
            </form>
        </>
    )
}