import React,{Component} from "react";
import {Link} from "react-router-dom";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";

class BreadCrumbCompo extends Component {

    constructor(props){
        super(props);
        this.renderRoutes = this.renderRoutes.bind(this);
    }

    renderRoutes(){
        const { t } = this.props;
        let item = null;
        return(
            this.props.routes && this.props.routes.map((route, i) =>  
            {  
                item = (<li key={'breadcrumb-' + i} className="tw-flex">
                <div className="tw-flex tw-items-center">
                {i > 0 && (
                  <svg className="tw-h-full tw-w-3 tw-flex-shrink-0 tw-text-gray-300 dark:tw-text-white/20" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                    <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"></path>
                  </svg>
                  )}
                  {i < (this.props.routes.length - 1) ?
                  <Link to={route.path || '/'} className={"tw-text-xs tw-whitespace-nowrap tw-underline tw-underline-offset-2 tw-decoration-[rgba(var(--color-bravo),0.2)] text-muted hover:tw-text-gray-700" + (i > 0 ? ' tw-ml-4' : '') }>{t(route.name)}</Link>
                  :
                  <div className={"tw-text-xs tw-whitespace-nowrap tw-font-bold tw-text-color hover:tw-text-gray-700" + (i > 0 ? ' tw-ml-4' : '') }>{t(route.name)}</div>
                }

                </div>
              </li>)

                
                return item;
            } 
            )              
        );
    }
    render(){
        return(
            <nav className="tw-flex tw-h-6 tw-rounded tw-overflow-x-auto" aria-label="Breadcrumb">
            <ol role="list" className="tw-flex tw-space-x-4 tw-bg-white/70 dark:tw-bg-black/20 tw-border tw-border-solid tw-border-transparent dark:tw-border-white/10 tw-px-6 tw-mb-0">
                {this.renderRoutes()}
            </ol>
          </nav>
        );
    }
}

BreadCrumbCompo.propTypes = {
    routes: Proptypes.array.isRequired
};

const BreadCrumbCompoTranslated = withTranslation('common')(BreadCrumbCompo)
export default BreadCrumbCompoTranslated