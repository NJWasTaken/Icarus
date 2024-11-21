import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, Edit2, ChevronDown } from 'lucide-react';
import Navigation from './contexts/Nav';
import './css/ExpenseTracker.css';
import { useAuth } from './contexts/AuthContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">{label}</p>
        <p className="tooltip-expense">
          <span className="tooltip-label">Name:</span>
          <span className="tooltip-value">{payload[0].payload.name}</span>
        </p>
        <p className="tooltip-expense">
          <span className="tooltip-label">Amount:</span>
          <span className="tooltip-value">Rs.{payload[0].value.toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newExpense, setNewExpense] = useState({ name: '', amount: '', date: '' });
    const [editingExpense, setEditingExpense] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('All');
    const { user } = useAuth();
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    // Fetch expenses
    useEffect(() => {
        const fetchExpenses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/expenses`);
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
    .map((expense) => ({
      date: new Date(expense.date).toLocaleDateString(),
      amount: parseFloat(expense.amount),
      name: expense.name // Include expense name in the data
    }));


    // Calculate total spending for the selected month
    const totalSpending = filteredExpenses.reduce((sum, expense) => 
        sum + parseFloat(expense.amount), 0);

    // Add new expense
    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post(`${API_BASE_URL}/expenses`, newExpense);
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
        const response = await axios.put(`${API_BASE_URL}/expenses/${editingExpense._id}`, editingExpense);
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
        const response = await axios.delete(`${API_BASE_URL}/expenses/${id}`);
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
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading expenses...</p>
            </div>
          )}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <Navigation 
            isAuthenticated={!!user} 
            userEmail={user?.email}
          />
      
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
                  <LineChart 
                    data={graphData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#e0e0e0"
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="date"
                      stroke="#000"
                      tick={{ fill: '#000', fontSize: 12 }}
                      tickLine={{ stroke: '#000' }}
                    />
                    <YAxis 
                      stroke="#000"
                      tick={{ fill: '#000', fontSize: 12 }}
                      tickLine={{ stroke: '#000' }}
                      axisLine={{ stroke: '#000' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#443670"
                      strokeWidth={3}
                      dot={{ fill: '#443670', strokeWidth: 2, r: 4 }}
                      activeDot={{ 
                        fill: '#443670',
                        stroke: '#fff',
                        strokeWidth: 2,
                        r: 6,
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                      }}
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
                {editingExpense ? "-\tUpdate Expense" : "+\tAdd Expense"}
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