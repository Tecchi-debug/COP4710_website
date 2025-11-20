import React, { useState } from 'react';
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
                <div className="report-type">
                    <label htmlFor="report-type">Report Type:</label>
                    <select id="report-type" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <option value="">Select a report type</option>
                        <option value="annual-restaurant">Restaurant Annual Report</option>
                        <option value="annual-customer">Customer Annual Report</option>
                        <option value="annual-donor">Year-end Donation Report</option>
                        <option value="annual-needy">Annual Free Plate Report</option>
                    </select>
                </div>
                <div>{reportType}</div>
            </section>
        </div>
    );
}

export default Admin;