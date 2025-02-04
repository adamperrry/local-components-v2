import * as React from 'react';
import classnames from 'classnames';
import { Switch, Route, NavLink, RouteComponentProps, withRouter, Redirect } from 'react-router-dom';
import * as styles from './TertiaryNav.scss';
import IReactComponentProps from '../../../common/structures/IReactComponentProps';
import { FunctionGeneric } from '../../../common/structures/Generics';

// There is a known issue in TypeScript, which doesn't allow decorators to change the signature of the classes
// they are decorating. Due to this, if you are using @withRouter decorator in your code,
// you will see a bunch of errors from TypeScript.
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/24077#issuecomment-455487092
@(withRouter as any)
export class TertiaryNav extends React.Component<IReactComponentProps & RouteComponentProps> {
	render () {
		/**
		 * Store first route so we can automatically redirect to it.
		 */
		let firstRoute: React.ReactElement | undefined = undefined;

		const tertiaryNavRoutes = React.Children.map(this.props.children, (child: any) => {
			const propsWithoutChildren = { ...child.props };
			delete propsWithoutChildren.children;

			if (typeof firstRoute === 'undefined') {
				firstRoute = child;
			}

			return (
				<Route
					{...propsWithoutChildren}
					path={`${this.props.match.url}${propsWithoutChildren.path}`}
				/>
			);
		});

		return (
			<div
				className={classnames(
					styles.TertiaryNavContainer,
					this.props.className,
				)}
				id={this.props.id}
				style={this.props.style}
			>
				<ul className={classnames(styles.TertiaryNav)}>
					{this.props.children}
				</ul>
				{/* globally scoping TertiaryContent so overflow can be hijacked
				to make Drawer components work with overflowing content */}
				<div className={classnames(styles.TertiaryContent, "TertiaryContent")}>
					<Switch>
						{tertiaryNavRoutes}
						{firstRoute! &&
							(
								<Redirect
									from={`${this.props.match.url}`}
									to={`${this.props.match.url}${firstRoute!.props.path}`}
								/>
							)

						}
					</Switch>
				</div>
			</div>
		);
	}
}

interface ITertiaryNavItemProps extends IReactComponentProps {
	path: string;
	render?: FunctionGeneric;
	variant?: 'error';
}

// There is a known issue in TypeScript, which doesn't allow decorators to change the signature of the classes
// they are decorating. Due to this, if you are using @withRouter decorator in your code,
// you will see a bunch of errors from TypeScript.
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/24077#issuecomment-455487092
@(withRouter as any)
export class TertiaryNavItem extends React.Component<ITertiaryNavItemProps & RouteComponentProps> {
	render () {
		return (
			<li
				className={classnames(
					styles.TertiaryNavItem,
					this.props.className,
					{
						[styles.TertiaryNavItem__Error]: this.props.variant === 'error',
					},
				)}
			>
				<NavLink
					exact={true}
					to={`${this.props.match.url}${this.props.path}`}
					activeClassName={styles.TertiaryNavItem__Active}
				>
					{this.props.children}
				</NavLink>
			</li>
		);
	}
}
