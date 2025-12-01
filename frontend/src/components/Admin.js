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
    /*memberlist contains the list of members that have been fetched
        memberType is the type of searching method for the member
        reportData contains the report data that is going to be stored */
    const [memberList, setMemberList] = useState([]);
    const [memberType, setMemberType] = useState('');
    const [reportData, setReportData] = useState([]);

    // target user for the reports
    const [targetUser, setTargetUser] = useState(null);

    // Helper to handle dropdown changes
    const setTypeHelper = (e, setter) => {
        setter(e.target.value);
    };

    const memberFormMap = {
        "find-all": <GetAllMembers />,
        "find-member-type": <GetMemberByType />,
        "find-email": <GetMemberByEmail />
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <div className="selection-status">
                <strong>Current Target User: </strong>
                {targetUser ? (
                    <span>{targetUser.name} (ID: {targetUser.user_id})</span>
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
                        <option value="find-email">Find by Email</option>
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
                                return <UserRow key={member.user_id} user={member} setTarget={setTargetUser} />
                            })
                        }
                    </table>
                </section>
            </section>

            <hr />

            <section>
                <h2>2. Generate Reports</h2>
                <section className="report-form">
                    {targetUser ? (
                        <>
                            {targetUser.role === 'restaurant' && <AnnualRestaurantForm targetUser={targetUser} setReportData={setReportData} />}
                            {targetUser.role === 'customer' && <AnnualCustomerForm targetUser={targetUser} setReportData={setReportData} />}
                            {targetUser.role === 'donor' && <AnnualDonationReport targetUser={targetUser} setReportData={setReportData} />}
                            {targetUser.role === 'needy' && <AnnualFreePlateForm targetUser={targetUser} setReportData={setReportData} />}
                        </>
                    ) : (
                        <p>Please select a user in the "Find Member" section above first.</p>
                    )}
                </section>
                <section className="report-table">
                    <table>
                        <thead>
                            {
                                // Render the table header with the header elements
                                reportData.length > 0 && <ReportHeader data={reportData[0]} />
                            }
                        </thead>
                        <tbody>
                            {
                                reportData.length > 0 && reportData.map((entry) => <ReportRow data={entry} />)
                            }
                        </tbody>
                    </table>
                </section>
            </section>
        </div>
    );
}

// Object responsible for rendering the users
function UserRow({ user, setTarget }) {
    const { user_id, name, role } = user

    const updateTargetUser = (e) => {
        e.preventDefault();
        setTarget(user);
    }
    return (
        <tr onClick={updateTargetUser} role='button' style={{ cursor: 'pointer' }}>
            <td>{user_id}</td>
            <td>{name}</td>
            <td>{role}</td>
        </tr>
    )
}

// Object responsible to render the data received
function ReportRow({ data }) {
    return (
        <tr>
            {
                Object.entries(data).map(([key, value]) => {
                    return <td key={key}>{value.toString()}</td>
                })
            }
        </tr>
    )
}

function ReportHeader({ data }) {
    return (
        <tr>
            {
                Object.entries(data).map(([key, value]) => {
                    let cleanedString = key.split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                    return <th scope='col'>{cleanedString}</th>
                })
            }
        </tr>
    )
}
export default Admin;