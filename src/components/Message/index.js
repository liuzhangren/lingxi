//该组件用来作为message组件全局配置
import React from 'react';
import { message } from 'antd'

message.config({
  top: 50,
  duration: 3,
  maxCount: 1,
  // getContainer:() => document.getElementsByClassName('page_style_1'),
});


