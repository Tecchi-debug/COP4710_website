import React, { useState } from 'react';
import { setTypeHelper } from '../helper/Admin_helper';
/*
TODO: 
Four report types:
    1. Annual activity report for a restaurant
    2. Annual purchase report for a customer or a donner
    3. Annual report of free plates received by a needy
    4. Year-end donation report for a donner for tax purposes
Obtain member information:
    1. Generate a list of all members and their information
    2. filter for customers, donors, needys, and restaurants
    3. filter by email address
*/

function Admin() {
    const [reportType, setReportType] = useState('')
    const [memberType, setMemberType] = useState('')

    return (
        <div>
            <h1>Admin Panel</h1>
            <p>Welcome to the admin panel.</p>
            <section>
                <h2>Generate Reports</h2>
                <section className="report-type">
                    <label htmlFor="report-type">Report Type:</label>
                    <select id="report-type" value={reportType} onChange={(e) => setTypeHelper(e, setReportType)}>
                        <option value="">Select a report type</option>
                        <option value="annual-restaurant">Restaurant Annual Report</option>
                        <option value="annual-customer">Customer Annual Report</option>
                        <option value="annual-donor">Year-end Donation Report</option>
                        <option value="annual-needy">Annual Free Plate Report</option>
                    </select>
                </section>
                <section className="report-form">
                    <h2>Section will be responsible to display the form for the selected report type</h2>
                    <p>Selected report type: {reportType}</p>
                </section>
                <section className="report-display">
                    <p>Section will be responsible to display the report for the selected report type after the form is submitted</p>
                </section>
            </section>
            <section>
                <h2>Member Reports</h2>
                <section className="member-type">
                    <label htmlFor="member-type">Member Type:</label>
                    <select id="member-type" value={memberType} onChange={(e) => setTypeHelper(e, setMemberType)}>
                        <option value="">Select a member type</option>
                        <option value="find-all">Get All Members</option>
                        <option value="find-member-type">Find by Member Type</option>
                        <option value="find-email">Find by Email</option>
                    </select>
                </section>
                <section className="member-form">
                    <h2>Section will be responsible to display the form for the selected member type</h2>
                    <p>Selected member type: {memberType}</p>
                </section>
                <section className="member-display">
                    <p>Section will be responsible to display the member information for the selected member type after the form is submitted</p>
                </section>
            </section>
        </div>
    );
}

export default Admin;