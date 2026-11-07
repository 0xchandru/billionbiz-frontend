import { 
  ShoppingBag, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar,
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import styles from './Dashboard.module.css';

const metricData = [
  { title: 'Total Orders', value: '246', change: '+18.7%', icon: ShoppingBag, color: '#198754', bgColor: '#e8f5e9' },
  { title: 'Total Revenue', value: '$12,589.00', change: '+22.5%', icon: DollarSign, color: '#0d6efd', bgColor: '#cfe2ff' },
  { title: 'Average Order Value', value: '$51.17', change: '+6.3%', icon: ShoppingCart, color: '#6f42c1', bgColor: '#e0cffc' },
  { title: 'Total Customers', value: '1,429', change: '+15.2%', icon: Users, color: '#fd7e14', bgColor: '#ffe5d0' }
];

const revenueData = [
  { name: 'May 20', revenue: 3000 },
  { name: 'May 21', revenue: 4000 },
  { name: 'May 22', revenue: 6000 },
  { name: 'May 23', revenue: 5000 },
  { name: 'May 24', revenue: 7000 },
  { name: 'May 25', revenue: 6000 },
  { name: 'May 26', revenue: 9000 },
];

const orderStatusData = [
  { name: 'Completed', value: 156, color: '#20c997' },
  { name: 'Processing', value: 54, color: '#4dabf7' },
  { name: 'Pending', value: 24, color: '#ffc107' },
  { name: 'Cancelled', value: 12, color: '#b197fc' },
];

const recentOrders = [
  { id: '#BBZ-1001', customer: 'David Johnson', date: 'May 26, 2025', status: 'Completed', total: '$129.00' },
  { id: '#BBZ-1002', customer: 'Sarah Williams', date: 'May 26, 2025', status: 'Processing', total: '$89.00' },
  { id: '#BBZ-1003', customer: 'Michael Brown', date: 'May 25, 2025', status: 'Pending', total: '$45.00' },
  { id: '#BBZ-1004', customer: 'Emily Davis', date: 'May 24, 2025', status: 'Completed', total: '$199.00' },
  { id: '#BBZ-1005', customer: 'James Wilson', date: 'May 24, 2025', status: 'Cancelled', total: '$65.00' },
];

const topProducts = [
  { name: 'Modern Desk Lamp', orders: 32, revenue: '$1,920.00', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop' },
  { name: 'Minimalist Chair', orders: 28, revenue: '$2,380.00', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&h=100&fit=crop' },
  { name: 'Wooden Table', orders: 24, revenue: '$3,120.00', img: 'https://images.unsplash.com/photo-1581428982868-e410dd447bf4?w=100&h=100&fit=crop' },
  { name: 'Ceramic Vase', orders: 22, revenue: '$1,100.00', img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=100&h=100&fit=crop' },
  { name: 'Wall Clock', orders: 18, revenue: '$720.00', img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=100&h=100&fit=crop' },
];

const getStatusBadgeClass = (status: string) => {
  switch(status) {
    case 'Completed': return styles.badgeSuccess;
    case 'Processing': return styles.badgeProcessing;
    case 'Pending': return styles.badgePending;
    case 'Cancelled': return styles.badgeCancelled;
    default: return '';
  }
};

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Here's what's happening with your store today.</p>
        </div>
        <button className={styles.datePickerBtn}>
          <Calendar size={16} />
          <span>May 20 – May 26, 2025</span>
        </button>
      </div>

      <div className={styles.metricsGrid}>
        {metricData.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ backgroundColor: metric.bgColor, color: metric.color }}>
              <metric.icon size={24} />
            </div>
            <div className={styles.metricContent}>
              <p className={styles.metricTitle}>{metric.title}</p>
              <div className={styles.metricValues}>
                <h2 className={styles.metricValue}>{metric.value}</h2>
                <div className={styles.metricChange}>
                  <ArrowUpRight size={14} />
                  <span>{metric.change} vs last 7 days</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Overview</h3>
            <select className={styles.select}>
              <option>Revenue</option>
            </select>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} tickFormatter={(value) => `$${value/1000}K`} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="revenue" stroke="#20c997" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Order Status</h3>
          </div>
          <div className={styles.donutContainer}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.donutCenter}>
              <span className={styles.donutTotal}>246</span>
              <span className={styles.donutLabel}>Total</span>
            </div>
            <div className={styles.legend}>
              {orderStatusData.map((entry, index) => (
                <div key={index} className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: entry.color }} />
                  <span className={styles.legendName}>{entry.name}</span>
                  <span className={styles.legendValue}>
                    {entry.value} ({(entry.value / 246 * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tablesGrid}>
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Recent Orders</h3>
            <a href="#" className={styles.viewAll}>View all orders</a>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td className={styles.fw500}>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>
                      <span className={`${styles.badge} ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className={styles.fw500}>{order.total}</td>
                    <td>
                      <button className={styles.actionBtn}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Top Products</h3>
            <a href="#" className={styles.viewAll}>View all products</a>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <div className={styles.productCell}>
                        <img src={product.img} alt={product.name} className={styles.productImg} />
                        <span className={styles.fw500}>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.orders}</td>
                    <td className={styles.fw500}>{product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
