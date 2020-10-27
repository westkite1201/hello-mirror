import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import {AccountBookOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/react-hooks';
import { GET_QUOTES} from '../../lib/graphql/admin'
import StatusCard  from  '../../component/StatusCard/StatusCard'
// import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
//import './App.css';

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;



interface Quote{
  NAME : String,
  WORD : String 
}
interface Quotes{
  quotes:Quote[]
  
}
function Admin() {
    const [collapsed, setCollapsed] = useState(false)
    const { loading, data, error } = useQuery<Quotes>(GET_QUOTES, {
      variables: { status: '0'},  // useQuery 사용할 때 변수 넘기는 방법
    });
    console.log('[seo] data', data, error)
    const onCollapse = (collapsed) => {
      setCollapsed(collapsed)
    }
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
        >
          <div className="App-logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <AccountBookOutlined type="pie-chart" />
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <AccountBookOutlined type="desktop" />
              <span>Option 2</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span><AccountBookOutlined type="user" /><span>User</span></span>}
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><AccountBookOutlined type="team" /><span>Team</span></span>}
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <AccountBookOutlined type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              Bill is a cat.
            </div>
            <StatusCard count = {data && data.quotes.length !==0 ?  data.quotes.length : 0}  info ={'테스트입니다'} />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  
}

export default Admin;