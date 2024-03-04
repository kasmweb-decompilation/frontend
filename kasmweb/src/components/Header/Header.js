import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { search, selectCategory, setShowProfile, setProfileDropdown, setProfileSection } from "../../actions/actionDashboard";
import Select from "react-select";
import {
  NavbarToggler,
} from "reactstrap";
import { connect } from "react-redux";
import { logout } from "../../actions/actionLogin";
import { Link } from "react-router-dom";
import allApps from "../../../assets/images/apps.png";
import apps from "../../../assets/images/workspaces.svg";

import { USER_NAME } from "../../constants/Constants";
import UserProfile from "../../components/UserProfile";
import _ from "lodash";
import getUserNavigationBarItems from "../Sidebar/getUserNavigationBar";

import "./Header.css";
import configure from "../../../assets/images/configure.svg";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      showSearch: false,
      showCategories: false,
      categories: [],
    };

    this.dropdownRef = React.createRef();
    this.avatarRef = React.createRef();
    this.searchRef = React.createRef();
    this.categoryRef = React.createRef();

    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.toggleCategories = this.toggleCategories.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.setShowProfile = this.setShowProfile.bind(this);
  }

  selectCategory (value) {
    this.props.selectCategory(value)
  }

  setShowProfile () {
    this.props.setShowProfile(true);
  }

  toggleSearch () {
    const next = !this.state.showSearch
    this.setState({ showSearch: next })
  }

  toggleCategories () {
    const next = !this.state.showCategories
    this.setState({ showCategories: next })
  }

  getCategories() {
    const {t} = this.props;
    const pathname =
    this.props.history &&
    this.props.history.location &&
    this.props.history.location.pathname;

    let availableCategories
    if (pathname === "/registry") {
      availableCategories = _.map(this.props.registryCategories, (el) => ({ id: el, label: t(['workspaces.' + el, el]) }));
    } else {
      availableCategories = _.map(this.props.availableCategories, (el) => ({ id: el, label: t(['workspaces.' + el, el]) }));
    }
  
    return [
      { id: "all", label: t('workspaces.all-workspaces') },
      ...availableCategories
    ];
  }
  

  componentDidMount() {
    document.addEventListener("mousedown", this.onOutsideClick);
    
    const pathname =
    this.props.history &&
    this.props.history.location &&
    this.props.history.location.pathname;
    if(pathname === '/userprofile' || pathname === '/adminprofile') {
      this.props.setShowProfile(true)
      this.props.setProfileDropdown(true)
      this.props.setProfileSection('settings')
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onOutsideClick);
  }

  handleSearch(e) {
    const value = e.target.value ? e.target.value.toLowerCase() : "";
    this.props.search(value);
  }

  onOutsideClick(event) {
    if(this.state.showSearch && this.searchRef.current && this.searchRef.current.contains(event.target) == false) {
      this.setState({
        showSearch: false
      });
    }
    if(this.state.showCategories && this.categoryRef.current && this.categoryRef.current.control.contains(event.target) == false) {
      this.setState({
        showCategories: false
      });
    }
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-minimized");
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-mobile-show");
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("aside-menu-hidden");
  }

  render() {
    if (this.searchRef.current && this.props.searchText === '') {
      this.searchRef.current.value = ''
    }
    let lastPage = "";
    let header_logo = window.localStorage.getItem("header_logo");
    header_logo = header_logo ? header_logo : "img/headerlogo.svg";
    let elem = document.getElementById("favicon");
    let favicon_logo = window.localStorage.getItem("favicon_logo");

    if (favicon_logo != undefined) {
      elem.href = favicon_logo;
    }

    let html_title = window.localStorage.getItem("html_title");

    if (html_title != undefined) {
      document.title = html_title;
    }

    const { t, i18n } = this.props

    const userInfo = JSON.parse(window.localStorage.getItem("user_info"));

    const userName = USER_NAME ? USER_NAME.slice(0, 2) : "";
    const initials = userName.charAt(0).toUpperCase() + userName.charAt(1).toLowerCase();
    const pathname =
      this.props.history &&
      this.props.history.location &&
      this.props.history.location.pathname;

    lastPage =
      pathname === "/dashboard"
        ? ""
        : pathname === "/userdashboard"
        ? lastPage
        : pathname;

    return (
      <React.Fragment>
      <header className={
        (pathname === "/userdashboard" || pathname === "/subscribe" ? "workspaces" : "admin") + " app-header navbar" + (this.props.showProfile ? " showprofile" : "")
      }>
        <div className="logo-buttons">
          {!(pathname === "/userdashboard" || pathname === "/userprofile") && (
            <NavbarToggler
              className="d-lg-none"
              onClick={this.mobileSidebarToggle}
            >
              <FontAwesomeIcon icon={faBars} aria-hidden="true" />
            </NavbarToggler>
          )}
          <div className="tw-hidden md:tw-flex tw-items-center tw-w-[280px] tw-text-white/50 tw-font-medium">
          <Link to={"/"}>
            <img
              className="header_logo"
              src={header_logo}
              height="35"
              alt="logo"
            />
          </Link>
          </div>
          
            <div className="appbox">
            {_.get(userInfo, 'authorized_views.user_dashboard', false) && _.get(userInfo, 'authorized_views.admin_dashboard', false) && (
              <Link to={"/userdashboard"}>
                <button
                  className={
                    pathname === "/userdashboard" ? "active" : "app-btn"
                  }
                >
                  {" "}
                   <img src={apps} alt="apps" />{" "}
                  <span className="icon-description">{t('header.Workspaces')}</span>
                </button>
              </Link>
            )}
             {_.get(userInfo, 'authorized_views.admin_dashboard', false) && (
              <Link to={lastPage ? lastPage : "/dashboard"}>
                <button
                  className={
                    !(pathname === "/userdashboard")
                      ? "active"
                      : "app-btn"
                  }
                >
                  {" "}
                  <img src={configure} alt="settings" />{" "}
                  <span className="icon-description">{t('header.Admin')}</span>
                </button>
              </Link>
              )}
            </div>
          
          {__KASM_BUILD_ID__ === '0.0.0.dev' && (
          <div className="tw-ml-8 tw-hidden md:tw-flex tw-gap-2">
            <button className="tw-bg-transparent tw-p-4 active" onClick={() => i18n.changeLanguage('en')}>en</button>
            <button className="tw-bg-transparent tw-p-4 active" onClick={() => i18n.changeLanguage('de')}>de</button>
        </div>
          )}
        </div>


        {userName && (
          <div className="navbar-right">
            {(pathname === "/userdashboard" || pathname === "/registry") && (
              <React.Fragment>
              <div
                className={ (this.state.showSearch ? 'expanded ' : '') + 'appdropdown tw-mx-2'}
                >
                <div className={ (this.state.showSearch ? 'expanded ' : '') + 'circle-search'}>
                  <input 
                    className="tw-border-0 !tw-px-0" 
                    ref={this.searchRef} 
                    type="text" 
                    placeholder={t("header.search_placeholder")} 
                    onChange={this.handleSearch} 
                    onBlur={() => this.setState({ showSearch: false })} 
                    onKeyUp={(e) => {
                      if(e.key === 'Enter') {
                        this.toggleSearch()
                      }
                    }}
                  />
                  <span onClick={(e) => {
                    this.toggleSearch() 
                    this.searchRef.current.focus()
                  }} className="text-white search-button"><FontAwesomeIcon icon={faSearch} /></span>
                </div>
              </div>
              <div
                className={ (this.state.showCategories ? 'expanded ' : '') + 'appdropdown tw-mx-2'}
                >
                <div className={ (this.state.showCategories ? 'expanded ' : '') + 'circle-search'}>
                  <div className="select-container">
                  <Select
                    id="select-category"
                    options={this.getCategories()}
                    value={this.props.selectedCategory}
                    valueKey="id"
                    labelKey="label"
                    name="select-category"
                    placeholder={t("workspaces.select")}
                    clearable={true}
                    onChange={this.selectCategory}
                    ref={this.categoryRef}
                  />
                  </div>
                  <span onClick={(e) => this.toggleCategories() } className="text-white search-button"><FontAwesomeIcon icon={faTag} /></span>
                </div>
                
              </div>
              </React.Fragment>
            )}


            <div
              ref={this.avatarRef}
              className="appdropdown tw-mx-2 tw-cursor-pointer"
              onClick={(e) => this.props.setProfileDropdown( !this.props.profileDropdown ) }>
              <div className="circle avatar">
                <span className="initials">{initials}</span>
              </div>
            </div>
            {this.props.profileDropdown && (
              <UserProfile history={this.props.history} forwardedRef={ this.dropdownRef }></UserProfile>
            )}
          </div>
        )}

      </header>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    availableCategories: state.dashboard.availableCategories || [],
    registryCategories: state.images.allCategories || [],
    profileSection: state.dashboard.profileSection || 'details',
    selectedCategory: state.dashboard.selectedCategory || null,
    selectedCategory: state.dashboard.selectedCategory || null,
    showProfile: state.dashboard.showProfile || false,
    profileDropdown: state.dashboard.profileDropdown || false,
    searchText: state.dashboard.search || '',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: (logout_data) => {
      dispatch(logout(logout_data));
    },
    search: (data) => {
      dispatch(search(data));
    },
    selectCategory: (data) => {
      dispatch(selectCategory(data));
    },
    setProfileSection: (data) => {
      dispatch(setProfileSection(data))
    },
    setShowProfile: (data) => {
      dispatch(setShowProfile(data));
    },
    setProfileDropdown: (data) => {
      dispatch(setProfileDropdown(data));
    },
  };
}
const HeaderTranslated = withTranslation('common')(Header)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderTranslated));
