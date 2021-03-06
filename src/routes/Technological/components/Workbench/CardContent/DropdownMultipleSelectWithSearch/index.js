import React, { Component } from "react";
import { Menu, Dropdown, Input, message, Icon } from "antd";
import styles from "./index.less";
import chackImg from "./../../../../../../assets/workbench/check@2x.png";
import personGroupImg from "./../../../../../../assets/workbench/person_group@2x.png";
import Cookies from "js-cookie";

/*eslint-disable*/
class DropdownMultipleSelectWithSearch extends Component {
  constructor(props) {
    super(props)
    const currentUser = this.getCurrentUserFromLocalStorage('userInfo')
    const { list, handleSelectedItemChange } = props;
    const findUserInList = list.find(item => item.id === currentUser.id)
    if(findUserInList) {
      handleSelectedItemChange([findUserInList])
    }
    this.state = {
      selectedList: findUserInList ? [findUserInList] : [],
      searchValue: "",
     dropdownOptionVisible: false
    }
  }
  getCurrentUserFromLocalStorage = key => {
    try {
      const currentUserFromLocalStorage = localStorage.getItem(key)
      if(currentUserFromLocalStorage) {
        return JSON.parse(currentUserFromLocalStorage)
      }
      message.error(`从localStorage 获取 ${key} 失败`)
    } catch (e) {
      message.error(`从localStorage 获取 ${key} 失败`)
    }
  }
  getCurrentUserFromCookie = key => {
    try{
      const currentUserFromCookie = JSON.parse(Cookies.get(key));
        if (currentUserFromCookie) {
          return currentUserFromCookie
        } else {
          message.error(`从Cookie中获取 ${key} 失败`)
        }
    }catch(e) {
      message.error(`从Cookie中获取 ${key} 失败`)
    }
  }
  handleSearchValue = e => {
    this.setState({
      searchValue: e.target.value
    });
  };
  handleDropdownVisibleChange = flag => {
    this.setState({
      dropdownOptionVisible: flag
    });
  };
  handleDeleteSelectedItem = shouldDeleteItem => {
    const {handleSelectedItemChange} = this.props
    this.setState(state => {
      return {
        selectedList: state.selectedList.filter(
          item => item.id !== shouldDeleteItem.id
        )
      };
    }, () => {
      const {selectedList} = this.state
      handleSelectedItemChange(selectedList)
    });
  };
  handleDeleteSelectedItemAll = () => {
    this.setState(() => {
      return {
        selectedList: []
      };
    }, () => {
      const {handleSelectedItemChange} = this.props
      handleSelectedItemChange([])
    });
  };
  handleClickedSelectAllBtn = () => {
    const { selectedList } = this.state;
    const { list, handleSelectedItemChange } = this.props;

    //如果现在是部分选中，那么就全选
    if (
      (list.length &&
        selectedList.length &&
        list.length !== selectedList.length) ||
      (list.length && !selectedList.length)
    ) {
      this.setState((state, props) => {
        handleSelectedItemChange(list);
        return {
          selectedList: [...list]
        };
      });
    } else {
      this.setState((state, props) => {
        handleSelectedItemChange([]);
        return {
          selectedList: []
        };
      });
    }
  };
  handleClickedAddBtn = e => {
    e.stopPropagation();
    const { list } = this.props;
    if (!list || !list.length) {
      message.destroy();
      message.warning("请先选择项目");
    }
  };
  handleSelectedItem = selectedKeys => {
    const { handleSelectedItemChange } = this.props;
    this.setState((state, props) => {
      const hasSelectedList = selectedKeys.map(item =>
        props.list.find(i => i.id === item)
      );
      handleSelectedItemChange(hasSelectedList);
      return {
        selectedList: hasSelectedList
      };
    });
  };
  handleDeSelectedMenuItem = ({ item, key, selectedKeys }) => {
    this.handleSelectedItem(selectedKeys);
  };
  handleSelectedMenuItem = ({ item, key, selectedKeys }) => {
    this.handleSelectedItem(selectedKeys);
  };
  handleClickedMenuItem = ({ item, id }) => {
    // console.log(item, id, "ccccccccccccccccccccccccccccccccccc");
  };
  handleList = () => {
    const { list } = this.props;
    const { selectedList, searchValue } = this.state;
    if (searchValue) {
      return {
        filteredList:
          list && list.length
            ? list.filter(item =>
                item.full_name.toLowerCase().includes(searchValue.toLowerCase())
              )
            : [],
        isSelectedAll:
          list && list.length && selectedList.length === list.length
      };
    } else {
      return {
        filteredList: list,
        isSelectedAll:
          list && list.length && selectedList.length === list.length
      };
    }
  };
  renderMenuItem = () => {
    const { selectedList } = this.state;
    const { filteredList } = this.handleList();
    return filteredList.map(item => {
      const isSelectCurrItem = selectedList.find(
        selected => selected.full_name === item.full_name
      );
      return (
        <Menu.Item key={item.id}>
          <p style={{ position: "relative" }}>
            {item.avatar ? (
              <img
                src={item.avatar}
                width="20"
                height="20"
                alt=""
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <Icon
                type="user"
                style={{ width: "20", height: "20", borderRadius: "50%" }}
              />
            )}
            <span style={{ marginLeft: "5px", userSelect: "none" }}>
              {item.full_name}
            </span>
            <span style={{ position: "absolute", width: "20px", right: "0" }}>
              {isSelectCurrItem && <img src={chackImg} alt="" width="16" />}
            </span>
          </p>
        </Menu.Item>
      );
    });
  };
  renderDropdownContent = () => {
    const { searchValue, selectedList } = this.state;
    const { list } = this.props;
    const { isSelectedAll } = this.handleList();
    const selectedKeys = selectedList.map(item => item.id);
    return (
      <div>
        {list.length !== 0 && (
          <Input
            placeholder="搜索"
            value={searchValue}
            onChange={this.handleSearchValue}
          />
        )}
        {list.length !== 0 && (
          <div
            className={styles.dropdownContentAll}
            onClick={this.handleClickedSelectAllBtn}
          >
            <img src={personGroupImg} alt="" width="20" height="20" />{" "}
            <span className={styles.dropdownContentAllTitle}>项目全体人员</span>
            <span style={{ position: "absolute", width: "20px", right: "0" }}>
              {isSelectedAll && <img src={chackImg} alt="" width="16" />}
            </span>
          </div>
        )}
        <div className={styles.dropdownContentMenuWrapper}>
          <Menu
            // style={{ maxHeight: "240px", overflowY: "auto" }}
            multiple={true}
            onClick={this.handleClickedMenuItem}
            onSelect={this.handleSelectedMenuItem}
            onDeselect={this.handleDeSelectedMenuItem}
            selectedKeys={selectedKeys}
          >
            {this.renderMenuItem()}
          </Menu>
        </div>
      </div>
    );
  };
  renderSelectedItem = selectedItem => {
    const { isSelectedAll } = this.handleList();
    if (isSelectedAll) {
      return (
        <div className={styles.contentListItemWrapper}>
          <span className={styles.contentListItemContent} title="全体成员">
            <img
              className={styles.contentListItemImg}
              src={personGroupImg}
              width="24"
              height="24"
              alt=""
            />
            <span
              className={styles.contentListItemDeleBtn}
              onClick={this.handleDeleteSelectedItemAll}
            />
          </span>
        </div>
      );
    }
    return selectedItem.map(item => (
      <div className={styles.contentListItemWrapper} key={item.id}>
        <span className={styles.contentListItemContent} title={item.full_name}>
          {item.avatar ? (
            <img
              className={styles.contentListItemImg}
              src={item.avatar}
              width="24"
              height="24"
              alt=""
            />
          ) : (
            <Icon
              type="user"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px"
              }}
              className={styles.contentListItemImg}
            />
          )}
          <span
            className={styles.contentListItemDeleBtn}
            onClick={() => this.handleDeleteSelectedItem(item)}
          />
        </span>
      </div>
    ));
  };
  comparePropsList = (nextList, currList) => {
    if (nextList.length !== currList.length) {
      return false;
    }
    const isFindAllNextListInCurrList = () =>
      nextList.every(item => currList.find(i => i.id === item.id));
    if (!isFindAllNextListInCurrList()) {
      return false;
    }
    return true;
  };
  componentWillReceiveProps(nextProps) {
    const { list, handleSelectedItemChange } = this.props;
    const isReceiveSameListFromProps = this.comparePropsList(
      nextProps.list,
      list
    );
    if (!isReceiveSameListFromProps) {
      const currentUserFromCookie = this.getCurrentUserFromLocalStorage('userInfo')
      if(currentUserFromCookie) {
        const currentUserId = currentUserFromCookie.id;
          const currentUserInList = nextProps.list.find(
            item => item.id === currentUserId
          );
          this.setState({
            selectedList: currentUserInList ? [currentUserInList] : [],
            searchValue: ""
          }, () => {
            if(currentUserInList) {
              handleSelectedItemChange([currentUserInList])
            }
          });
      } else {
        this.setState({
          selectedList: [],
          searchValue: ""
        });
      }
    }
  }
  render() {
    const { dropdownOptionVisible, selectedList } = this.state;
    const { itemTitle } = this.props;
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.contentTitle}>{itemTitle} </div>
          <div className={styles.contentList}>
            {this.renderSelectedItem(selectedList)}
          </div>
          <Dropdown
            overlay={this.renderDropdownContent()}
            visible={dropdownOptionVisible}
            onVisibleChange={this.handleDropdownVisibleChange}
          >
            <div
              className={styles.contentListAdd}
              onClick={this.handleClickedAddBtn}
            />
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default DropdownMultipleSelectWithSearch;
