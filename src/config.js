/* Fictional game configuration. Not measured Hanoi data. */
window.HBT_CONFIG = {
  "regions": [
    {
      "id": "core",
      "name": "Lõi đô thị",
      "short": "Lõi đô thị",
      "x": 300,
      "y": 205,
      "type": "Trung tâm",
      "desc": "Vùng khái niệm có nhu cầu giả định cao, nhưng chi phí mặt bằng và cạnh tranh cao.",
      "demand": 1.25,
      "income": 1.25,
      "rent": 1.35,
      "access": 1.2,
      "competition": 0.35,
      "growth": 0.035,
      "color": "#d27b3e"
    },
    {
      "id": "west",
      "name": "Cực phía Tây",
      "short": "Phía Tây",
      "x": 180,
      "y": 145,
      "type": "Cực phát triển",
      "desc": "Vùng khái niệm giả định về dân cư mới và hoạt động văn phòng; chi phí trung bình.",
      "demand": 1.05,
      "income": 1.12,
      "rent": 0.95,
      "access": 1.05,
      "competition": 0.22,
      "growth": 0.075,
      "color": "#4f7fba"
    },
    {
      "id": "east",
      "name": "Cực phía Đông",
      "short": "Phía Đông",
      "x": 470,
      "y": 210,
      "type": "Cực phát triển",
      "desc": "Vùng khái niệm giả định có tiềm năng tăng trưởng nhờ đô thị hóa và kết nối.",
      "demand": 0.92,
      "income": 1.02,
      "rent": 0.78,
      "access": 0.92,
      "competition": 0.16,
      "growth": 0.09,
      "color": "#4f7fba"
    },
    {
      "id": "north",
      "name": "Vành đai phía Bắc",
      "short": "Phía Bắc",
      "x": 390,
      "y": 85,
      "type": "Đang phát triển",
      "desc": "Nhu cầu giả định vừa phải, chi phí thấp hơn; tăng trưởng phụ thuộc vào dân cư và kết nối.",
      "demand": 0.75,
      "income": 0.92,
      "rent": 0.62,
      "access": 0.78,
      "competition": 0.12,
      "growth": 0.085,
      "color": "#57a781"
    },
    {
      "id": "south",
      "name": "Cực phía Nam",
      "short": "Phía Nam",
      "x": 280,
      "y": 350,
      "type": "Cực phát triển",
      "desc": "Vùng khái niệm giả định pha trộn khu dân cư và hoạt động sản xuất.",
      "demand": 0.88,
      "income": 0.94,
      "rent": 0.72,
      "access": 0.86,
      "competition": 0.18,
      "growth": 0.065,
      "color": "#4f7fba"
    },
    {
      "id": "outer",
      "name": "Vùng ven",
      "short": "Vùng ven",
      "x": 560,
      "y": 365,
      "type": "Vùng ven đô",
      "desc": "Chi phí giả định thấp nhưng nhu cầu và khả năng tiếp cận thấp hơn.",
      "demand": 0.62,
      "income": 0.78,
      "rent": 0.48,
      "access": 0.63,
      "competition": 0.08,
      "growth": 0.055,
      "color": "#57a781"
    }
  ],
  "sectors": {
    "retail": {
      "name": "Bán lẻ tiện ích",
      "baseRevenue": 150,
      "baseOpex": 65,
      "setup": 115,
      "accessWeight": 1.0,
      "needWeight": 1.0,
      "transportWeight": 0.12
    },
    "cafe": {
      "name": "Cà phê & F&B",
      "baseRevenue": 132,
      "baseOpex": 61,
      "setup": 90,
      "accessWeight": 1.15,
      "needWeight": 0.95,
      "transportWeight": 0.06
    },
    "logistics": {
      "name": "Điểm trung chuyển logistics",
      "baseRevenue": 170,
      "baseOpex": 78,
      "setup": 145,
      "accessWeight": 1.25,
      "needWeight": 0.82,
      "transportWeight": 0.18
    }
  }
};
