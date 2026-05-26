// Format date
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Calculate grade color
export const getGradeColor = (cgpa) => {
  if (cgpa >= 9) return 'success';
  if (cgpa >= 8) return 'primary';
  if (cgpa >= 7) return 'info';
  if (cgpa >= 6) return 'warning';
  return 'danger';
};

// Get compliance status
export const getComplianceStatus = (compliance) => {
  if (compliance >= 95) return { text: 'Excellent', color: 'success' };
  if (compliance >= 85) return { text: 'Good', color: 'primary' };
  if (compliance >= 70) return { text: 'Average', color: 'warning' };
  return { text: 'Needs Improvement', color: 'danger' };
};

// Get rating stars
export const getRatingStars = (rating) => {
  return '⭐'.repeat(Math.round(rating));
};

// Search filter
export const searchFilter = (items, query, fields) => {
  if (!query) return items;
  
  return items.filter(item => 
    fields.some(field => 
      String(item[field]).toLowerCase().includes(query.toLowerCase())
    )
  );
};

// Sort data
export const sortData = (data, key, direction = 'asc') => {
  return [...data].sort((a, b) => {
    if (direction === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

// Generate random color
export const generateColor = (index) => {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'
  ];
  return colors[index % colors.length];
};

// Validate email
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

// Truncate text
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Get initials
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Export to CSV
export const exportToCSV = (data, filename) => {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};