import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, Edit2, PlusCircle, ChevronDown } from 'lucide-react';
import './ExpenseTracker.css';

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newExpense, setNewExpense] = useState({ name: '', amount: '', date: '' });
    const [editingExpense, setEditingExpense] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('All');
  
    const navigation = [
      { name: 'Home', path: '/' },
      { name: 'Expenses', path: '/expenses' },
      { name: 'Login', path: '/login' },
      { name: 'Calendar', path: '/calendar'},
      { name: 'Events', path: '/events'}
    ];

    // Fetch expenses
    useEffect(() => {
        const fetchExpenses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:5000/api/expenses');
            if (response.data.success) {
            const sortedExpenses = response.data.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setExpenses(sortedExpenses);
            } else {
            setError('Failed to fetch expenses');
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setError(error.message || 'Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
        };
        fetchExpenses();
    }, []);

    const monthOptions = ['All', ...new Set(
        expenses.map(expense => 
          new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' })
        )
      )];
    
    // Filter expenses by selected month
    const filteredExpenses = selectedMonth === 'All' ? expenses : expenses.filter(expense => {
        const expenseMonth = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        return expenseMonth === selectedMonth;
        });

    // Prepare data for spending over time graph
    const graphData = filteredExpenses
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((expense, index, arr) => ({
        name: new Date(expense.date).toLocaleDateString(),
        amount: parseFloat(expense.amount),
        cumulative: arr
        .slice(0, index + 1)
        .reduce((sum, e) => sum + parseFloat(e.amount), 0)
    }));

    // Calculate total spending for the selected month
    const totalSpending = filteredExpenses.reduce((sum, expense) => 
        sum + parseFloat(expense.amount), 0);

    // Add new expense
    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post('http://localhost:5000/api/expenses', newExpense);
        if (response.data.success) {
            setExpenses([...expenses, response.data.data]);
            setNewExpense({ name: '', amount: '', date: '' });
        }
        } catch (error) {
        console.error('Error adding expense:', error);
        setError('Failed to add expense');
        }
    };

    // Update expense
    const handleUpdateExpense = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.put(`http://localhost:5000/api/expenses/${editingExpense._id}`, editingExpense);
        if (response.data.success) {
            setExpenses(expenses.map(exp => 
            exp._id === editingExpense._id ? response.data.data : exp
            ));
            setEditingExpense(null);
        }
        } catch (error) {
        console.error('Error updating expense:', error);
        setError('Failed to update expense');
        }
    };

    // Delete expense
    const handleDeleteExpense = async (id) => {
        try {
        const response = await axios.delete(`http://localhost:5000/api/expenses/${id}`);
        if (response.data.success) {
            setExpenses(expenses.filter(exp => exp._id !== id));
        }
        } catch (error) {
        console.error('Error deleting expense:', error);
        setError('Failed to delete expense');
        }
    };

    return (
        <div className="page-container">
          {/* Render loading state */}
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading expenses...</p>
            </div>
          )}

          {/* Render error state */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <nav className="navbar">
            <div className="nav-container">
              <Link to="/" className="logo">
                Alakazam
              </Link>
      
              <div className="nav-links">
                {navigation.map((item) => (
                  <Link key={item.name} to={item.path} className="nav-link">
                    {item.name}
                  </Link>
                ))}
              </div>
      
              <button
                className="mobile-menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
      
            <div className={`mobile-menu ${isMenuOpen ? "" : "hidden"}`}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
      
          <div className="expense-tracker-container">
            <h1 className="expense-tracker-title">Expense Tracker</h1>
      
            {/* Month Filter Dropdown */}
            <div className="month-filter-container">
              <div className="month-filter-select">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="month-dropdown"
                >
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <ChevronDown className="dropdown-icon" />
              </div>
              {selectedMonth !== "All" && (
                <div className="month-summary">
                  <span>Total Spending: Rs.{totalSpending.toFixed(2)}</span>
                </div>
              )}
            </div>
      
            {/* Spending Over Time Graph */}
            <div className="expense-graph-container">
              {graphData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#443670"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="no-data-message">No expenses for the selected month</p>
              )}
            </div>
      
            {/* Add/Edit Expense Form */}
            <form
              onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
              className="expense-form"
            >
              <div className="expense-form-fields">
                <input
                  type="text"
                  placeholder="Expense Name"
                  value={editingExpense ? editingExpense.name : newExpense.name}
                  onChange={(e) =>
                    editingExpense
                      ? setEditingExpense({
                          ...editingExpense,
                          name: e.target.value,
                        })
                      : setNewExpense({ ...newExpense, name: e.target.value })
                  }
                  className="expense-input"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={editingExpense ? editingExpense.amount : newExpense.amount}
                  onChange={(e) =>
                    editingExpense
                      ? setEditingExpense({
                          ...editingExpense,
                          amount: e.target.value,
                        })
                      : setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="expense-input"
                  required
                  step="0.01"
                />
                <input
                  type="date"
                  value={editingExpense ? editingExpense.date : newExpense.date}
                  onChange={(e) =>
                    editingExpense
                      ? setEditingExpense({
                          ...editingExpense,
                          date: e.target.value,
                        })
                      : setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="expense-input"
                  required
                />
              </div>
              <button type="submit" className="expense-form-button">
                <PlusCircle className="mr-2" />
                {editingExpense ? "Update Expense" : "Add Expense"}
              </button>
            </form>
      
            {/* Expenses List */}
            {expenses.length === 0 ? (
              <div className="no-expenses-container">
                <p className="no-expenses">
                  No expenses found. Add some expenses to get started!
                </p>
              </div>
            ) : (
              <ul className="expense-list">
                {expenses.map((expense) => (
                  <li key={expense._id} className="expense-item">
                    <div className="expense-details">
                      <span className="expense-name">{expense.name}</span>
                      <span className="expense-amount">Rs.{expense.amount}</span>
                      <span className="expense-date">
                        on {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="expense-actions">
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="expense-action expense-edit"
                        title="Edit Expense"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="expense-action expense-delete"
                        title="Delete Expense"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );      
    };
export default ExpenseTracker;