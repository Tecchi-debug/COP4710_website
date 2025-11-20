// File for any helper functions/ components needed for admin panel
import React, { useState } from 'react';

export function AnnualRestaurantForm({ targetUser }) {
    const [year, setYear] = useState(new Date().getFullYear());

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for report generation logic
        console.log(`Generating Annual Activity Report for Restaurant: ${targetUser?.name} (ID: ${targetUser?.id}) for year ${year}`);
    };

    return (
        <div className="report-form-container">
            <h3>Annual Restaurant Activity Report</h3>
            {targetUser ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <strong>Selected Restaurant: </strong> {targetUser.name}
                    </div>
                    <label>
                        Report Year:
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            min="2000"
                            max="2100"
                        />
                    </label>
                    <button type="submit">Generate Report</button>
                </form>
            ) : (
                <p>Please select a Restaurant from the "Find Member" section first.</p>
            )}
        </div>
    )
}

export function AnnualCustomerForm({ targetUser }) {
    const [year, setYear] = useState(new Date().getFullYear());

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Generating Annual Purchase Report for User: ${targetUser?.name} (ID: ${targetUser?.id}) for year ${year}`);
    };

    return (
        <div className="report-form-container">
            <h3>Annual Purchase Report (Customer/Donor)</h3>
            {targetUser ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <strong>Selected User: </strong> {targetUser.name}
                    </div>
                    <label>
                        Report Year:
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            min="2000"
                            max="2100"
                        />
                    </label>
                    <button type="submit">Generate Report</button>
                </form>
            ) : (
                <p>Please select a Customer or Donor from the "Find Member" section first.</p>
            )}
        </div>
    )
}

export function AnnualFreePlateForm({ targetUser }) {
    const [year, setYear] = useState(new Date().getFullYear());

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Generating Annual Free Plate Report for Needy: ${targetUser?.name} (ID: ${targetUser?.id}) for year ${year}`);
    };

    return (
        <div className="report-form-container">
            <h3>Annual Free Plates Report (Needy)</h3>
            {targetUser ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <strong>Selected Needy User: </strong> {targetUser.name}
                    </div>
                    <label>
                        Report Year:
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            min="2000"
                            max="2100"
                        />
                    </label>
                    <button type="submit">Generate Report</button>
                </form>
            ) : (
                <p>Please select a Needy user from the "Find Member" section first.</p>
            )}
        </div>
    )
}

export function AnnualDonationReport({ targetUser }) {
    const [year, setYear] = useState(new Date().getFullYear());

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Generating Tax Donation Report for Donor: ${targetUser?.name} (ID: ${targetUser?.id}) for year ${year}`);
    };

    return (
        <div className="report-form-container">
            <h3>Year-end Donation Tax Report</h3>
            {targetUser ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <strong>Selected Donor: </strong> {targetUser.name}
                    </div>
                    <label>
                        Report Year:
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            min="2000"
                            max="2100"
                        />
                    </label>
                    <button type="submit">Generate Report</button>
                </form>
            ) : (
                <p>Please select a Donor from the "Find Member" section first.</p>
            )}
        </div>
    )
}

export function GetAllMembers({ onUserSelect }) {
    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Fetching all members...");
        // Mock result for demonstration
        // onUserSelect({ id: 999, name: 'Mock User', role: 'customer' });
    };

    return (
        <div className="member-search-form">
            <h3>Find All Members</h3>
            <form onSubmit={handleSearch}>
                <p>Click below to retrieve a list of all registered users.</p>
                <button type="submit">List All Users</button>
            </form>
        </div>
    )
}

export function GetMemberByType({ onUserSelect }) {
    const [type, setType] = useState('customers');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(`Fetching members of type: ${type}`);
    };

    return (
        <div className="member-search-form">
            <h3>Find Members by Type</h3>
            <form onSubmit={handleSearch}>
                <label>
                    User Type:
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="customers">Customers</option>
                        <option value="donors">Donors</option>
                        <option value="needys">Needys</option>
                        <option value="restaurants">Restaurants</option>
                    </select>
                </label>
                <button type="submit">Filter Users</button>
            </form>
        </div>
    )
}

export function GetMemberByEmail({ onUserSelect }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(`Searching for member with email or name: ${searchTerm}`);
    };

    return (
        <div className="member-search-form">
            <h3>Find Member by Email or Name</h3>
            <form onSubmit={handleSearch}>
                <label>
                    Search:
                    <input
                        type="text"
                        placeholder="Enter email or name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </label>
                <button type="submit">Search</button>
            </form>
        </div>
    )
}