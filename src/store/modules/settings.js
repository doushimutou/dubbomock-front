
const state = {
  // showSettings: showSettings,
  fixedHeader: false,
  sidebarLogo: true,
  //组别枚举定义
  teamOptions:[
    {
      value: "0",
      label: "商家组"
    },
    {
      value: "1",
      label: "骑手组"
    },
    {
      value: "2",
      label: "支撑组"
    },
    {
      value: "3",
      label: "测开组"
    }
  ],
  //组别枚举定义
  hawkeye:[
    {
      name: "王锦涛",
      testerCode: "05055"
    },
    {
      name: "安义涛",
      testerCode: "05133"
    },
    {
      name: "杨远远",
      testerCode: "05140"
    },
    {
      name: "王楚",
      testerCode: "05278"
    },
    {
      name: "郑妮婷",
      testerCode: "05701"
    },
    {
      name: "傅嘉妮",
      testerCode: "05744"
    },
    {
      name: "曹南岚",
      testerCode: "05900"
    }
  ],
  
  spider:[
    {
      name: "卢婷",
      testerCode: "05174"
    },
    {
      name: "李辉",
      testerCode: "05691"
    }
  ],
  flash:[
    {
      name: "陈昕",
      testerCode: "04777"
    },
    {
      name: "袁小芳",
      testerCode: "04940"
    },
    {
      name: "陈倩",
      testerCode: "04779"
    },
    {
      name: "雷丽莹",
      testerCode: "05181"
    },
    {
      name: "白文霞",
      testerCode: "05279"
    },
  ],
  bigBangTest:[
    {
      name: "高晗",
      testerCode: "04467"
    },
    {
      name: "刘晶晶",
      testerCode: "04776"
    },
    {
      name: "臧朝鹏",
      testerCode: "04465"
    }
  ]
}


export default {
  namespaced: true,
  state
}

