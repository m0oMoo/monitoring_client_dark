export const MOCK_DATA: { [key: string]: { [key: string]: number[] } } = {
  users: {
    id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    age: [25, 32, 28, 40, 36, 50, 22, 30, 29, 41, 22, 11, 44],
    login_count: [10, 15, 20, 25, 5, 12, 9, 18, 30, 22, 12, 31, 10],
  },
  orders: {
    order_id: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 99, 88, 100],
    price: [120, 80, 60, 30, 10, 50, 45, 75, 90, 65, 60, 30, 10],
    quantity: [10, 20, 50, 30, 40, 60, 20, 30, 40, 50, 10, 70, 20, 0],
    discount: [10, 15, 50, 20, 25, 10, 30, 50, 15, 80, 10, 30, 80, 90],
    account: [100, 150, 50, 20, 25, 100, 300, 50, 15, 80, 100, 30, 80, 90],
  },
  products: {
    product_id: [
      201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 190, 200, 201,
    ],
    stock: [50, 100, 30, 70, 90, 20, 80, 60, 40, 110, 100, 40, 50, 90],
    rating: [
      4.5, 4.2, 3.8, 4.7, 4.0, 3.5, 4.9, 3.9, 4.1, 4.3, 2.2, 3.1, 1.1, 7,
    ],
  },
  sales: {
    month: [
      1900, 2020, 3020, 4030, 5100, 6030, 7010, 8000, 9000, 10000, 1100, 1200,
      5000, 4000,
    ],
    revenue: [
      5000, 6000, 7000, 8000, 7500, 8500, 9000, 9500, 7200, 8800, 7000, 8000,
      3500, 7000,
    ],
    profit: [
      1200, 1500, 1600, 1700, 1800, 2100, 2300, 2500, 2000, 2200, 1900, 2300,
      2400, 2600,
    ],
    units_sold: [50, 60, 70, 80, 75, 85, 90, 95, 72, 88, 100, 55, 32, 66],
  },
  traffic: {
    day: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    visitors: [
      500, 600, 700, 800, 900, 1000, 750, 850, 920, 880, 400, 500, 800,
    ],
    page_views: [
      1500, 1600, 1700, 1800, 1750, 1900, 2100, 2200, 1950, 2050, 1500, 2000,
      1900, 1200,
    ],
    bounce_rate: [50, 45, 40, 42, 39, 38, 41, 43, 37, 36, 21, 65, 34, 46],
  },
  engagement: {
    post_id: [
      301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 290, 300, 288, 310, 300,
    ],
    likes: [
      100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 290, 280, 200, 190,
    ],
    shares: [30, 25, 35, 40, 45, 50, 55, 60, 65, 70, 56, 60, 70, 40],
    comments: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 28, 32, 38],
  },
};

// ✅ 테이블 컬럼 매핑 (사용자가 선택할 수 있는 숫자 데이터만 포함)
export const COLUMNS: { [key: string]: string[] } = {
  users: ["id", "age", "login_count"],
  orders: ["order_id", "price", "quantity", "discount", "account"],
  products: ["product_id", "stock", "rating"],
  sales: ["month", "revenue", "profit", "units_sold"],
  traffic: ["day", "visitors", "page_views", "bounce_rate"],
  engagement: ["post_id", "likes", "shares", "comments"],
};

export const TARGET_OPTIONS = [
  { label: "Queue", value: "queue" },
  { label: "Topic", value: "topic" },
  { label: "Consumer", value: "consumer" },
  { label: "Durable", value: "durable" },
  { label: "Connection", value: "conn" },
  { label: "Producer", value: "producer" },
  { label: "Property", value: "prop" },
  { label: "Store", value: "store" },
  { label: "System Monitor", value: "sysmon" },
  { label: "Host Metrics", value: "host" },
];

export const metricOptionsMap: Record<
  string,
  { label: string; value: string }[]
> = {
  queue: [
    { label: "Pending Message Size", value: "pendMsgSize" },
    { label: "Pending Message Count", value: "pendMsgCnt" },
    { label: "Incoming Message Rate", value: "inMsgRate" },
    { label: "Outgoing Message Rate", value: "outMsgRate" },
  ],
  topic: [
    { label: "Publish Rate", value: "pubRate" },
    { label: "Subscribe Rate", value: "subRate" },
  ],
  consumer: [
    { label: "Acknowledgement Rate", value: "ackRate" },
    { label: "Unacknowledged Message Count", value: "unackMsgCnt" },
  ],
  durable: [{ label: "Durable Subscriptions", value: "durableSubs" }],
  conn: [
    { label: "Active Connections", value: "activeConn" },
    { label: "Pending Connections", value: "pendingConn" },
  ],
  producer: [{ label: "Producer Rate", value: "producerRate" }],
  prop: [
    { label: "Property Size", value: "propSize" },
    { label: "Property Count", value: "propCount" },
  ],
  store: [{ label: "Store Usage", value: "storeUsage" }],
  sysmon: [
    { label: "CPU Usage", value: "cpuUsage" },
    { label: "Memory Usage", value: "memUsage" },
  ],
  host: [
    { label: "Disk Usage", value: "diskUsage" },
    { label: "Network Traffic", value: "networkTraffic" },
  ],
};
