import React, { useState } from 'react';
// Report Form Components
import { AnnualRestaurantForm, AnnualCustomerForm, AnnualFreePlateForm, AnnualDonationReport } from '../helper/Admin_helper';
// Member Form Components
import { GetAllMembers, GetMemberByEmail, GetMemberByType } from '../helper/Admin_helper';

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
    // memberList has dummy placeholder data for now
    const [memberList, setMemberList] = useState([{
        id: 1, name: "Pizza Place", role: "restaurant"
    }, { id: 2, name: "Burger Place", role: "restaurant" }, { id: 2, name: "Pasta Place", role: "restaurant" }]);
    const [reportType, setReportType] = useState('');
    const [memberType, setMemberType] = useState('');

    // 1. New State: Tracks the user selected for the report
    const [targetUser, setTargetUser] = useState(null); // { id: 1, name: 'Pizza Place', role: 'restaurant' }

    // Helper to handle dropdown changes
    const setTypeHelper = (e, setter) => {
        setter(e.target.value);
    };

    // 2. Your Maps (Unchanged, but now we will inject props into them)
    const reportFormMap = {
        "annual-restaurant": <AnnualRestaurantForm />,
        "annual-customer": <AnnualCustomerForm />,
        "annual-donor": <AnnualDonationReport />,
        "annual-needy": <AnnualFreePlateForm />
    };

    const memberFormMap = {
        "find-all": <GetAllMembers />,
        "find-member-type": <GetMemberByType />,
        "find-email": <GetMemberByEmail />
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            {/* New Section: Feedback on who is selected */}

            <div className="selection-status">
                <strong>Current Target User: </strong>
                {targetUser ? (
                    <span>{targetUser.name} (ID: {targetUser.id})</span>
                ) : (
                    <span>None selected. Please find and select a member below first.</span>
                )}
            </div>

            <section>
                <h2>1. Find & Select Member</h2>
                <p>Use this section to find a user, then click "Select" in the results to set them as the target.</p>
                <section className="member-type">
                    <label htmlFor="member-type">Member Search Method:</label>
                    <select id="member-type" value={memberType} onChange={(e) => setTypeHelper(e, setMemberType)}>
                        <option value="">Select a method</option>
                        <option value="find-all">Get All Members</option>
                        <option value="find-member-type">Find by Member Type</option>
                        <option value="find-email">Find by Email or Name</option>
                    </select>
                </section>
                <section className="member-form">
                    {/* 3. Inject 'setMemberList' into the member form. 
                       The member forms must call props.setMemberList(usersArray) when search is performed.
                    */}
                    {memberType && memberFormMap[memberType] &&
                        React.cloneElement(memberFormMap[memberType], {
                            setMemberList: setMemberList
                        })
                    }
                </section>
                <section className="member-table">
                    <h2>Member List</h2>
                    <table>
                        {
                            // Generate a table that contains all the user
                            memberList.length > 0 && memberList.map((member) => {
                                return <UserRow key={member.id} user={member} setTarget={setTargetUser} />
                            })
                        }
                    </table>
                </section>
            </section>

            <hr />

            <section>
                <h2>2. Generate Reports</h2>
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
                    {/* 4. Inject 'targetUser' into the report form.
                       The report forms can now access props.targetUser.id to run the SQL query.
                    */}
                    {reportType && reportFormMap[reportType] ? (
                        targetUser ? (
                            React.cloneElement(reportFormMap[reportType], { targetUser })
                        ) : (
                            <p>Please select a user in the "Find Member" section above first.</p>
                        )
                    ) : null}
                </section>
            </section>
        </div>
    );
}

function UserRow({ user, setTarget }) {
    const { id, name, role } = user

    const updateTargetUser = (e) => {
        e.preventDefault();
        setTarget(user);
    }
    return (
        <tr onClick={updateTargetUser} role='button' style={{ cursor: 'pointer' }}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{role}</td>
        </tr>
    )
}

export default Admin;