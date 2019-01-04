/**
 * @class AttachedTooltip
 * @description The container of a lightweight and responsive tooltip.
 */
import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from './Tooltip';

class AttachedTooltip extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    direction: PropTypes.string,
    tooltipClassName: PropTypes.string,
    content: PropTypes.node.isRequired,
    background: PropTypes.string,
    color: PropTypes.string,
    padding: PropTypes.string,
    eventOff: PropTypes.string,
    eventOn: PropTypes.string,
    eventToggle: PropTypes.string,
    useHover: PropTypes.bool,
    useDefaultStyles: PropTypes.bool,
    isOpen: PropTypes.bool,
    hoverDelay: PropTypes.number,
    tipContentHover: PropTypes.bool,
    arrow: PropTypes.bool,
    arrowSize: PropTypes.number,
    distance: PropTypes.number,
  };
  static defaultProps = {
    direction: 'up',
    tooltipClassName: '',
    background: '',
    color: '',
    padding: '10px',
    useHover: true,
    useDefaultStyles: false,
    hoverDelay: 200,
    tipContentHover: false,
    arrow: true,
    arrowSize: 10,
    distance: undefined,
  };

  constructor() {
    super();

    this.state = {
      showTip: false,
      hasHover: false,
    };

    this.target = React.createRef();
    this.tip = React.createRef();

    this.showTip = this.showTip.bind(this);
    this.hideTip = this.hideTip.bind(this);
    this.checkHover = this.checkHover.bind(this);
    this.toggleTip = this.toggleTip.bind(this);
    this.startHover = this.startHover.bind(this);
    this.endHover = this.endHover.bind(this);
  }

  componentDidMount() {
    // if the isOpen prop is passed on first render we need to immediately trigger a second render,
    // because the tip ref is needed to calculate the position
    if (this.props.isOpen) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ isOpen: true });
    }
  }

  target = null;
  tip = null;

  toggleTip() {
    this.setState({ showTip: !this.state.showTip });
  }

  showTip() {
    this.setState({ showTip: true });
  }

  hideTip() {
    this.setState({ hasHover: false });
    this.setState({ showTip: false });
  }

  startHover() {
    this.setState({ hasHover: true });

    setTimeout(this.checkHover, this.props.hoverDelay);
  }

  endHover() {
    this.setState({ hasHover: false });

    setTimeout(this.checkHover, this.props.hoverDelay);
  }

  checkHover() {
    this.setState({ showTip: this.state.hasHover });
  }

  render() {
    const {
      direction,
      tooltipClassName,
      padding,
      children,
      content,
      eventOn,
      eventOff,
      eventToggle,
      useHover,
      background,
      color,
      useDefaultStyles,
      isOpen,
      tipContentHover,
      arrow,
      arrowSize,
      distance,
      ...others
    } = this.props;
    delete others.hoverDelay;

    const showTip = (typeof isOpen === 'undefined') ? this.state.showTip : isOpen;

    const props = {};

    // event handling
    if (eventOff) {
      props[eventOff] = this.hideTip;
    }

    if (eventOn) {
      props[eventOn] = this.showTip;
    }

    if (eventToggle) {
      props[eventToggle] = this.toggleTip;

      // only use hover if they don't have a toggle event
    } else if (useHover) {
      props.onMouseOver = this.startHover;
      props.onMouseOut = tipContentHover ? this.endHover : this.hideTip;
      props.onTouchStart = this.toggleTip;
    }

    // should ensure a single child (throws an error instead)
    React.Children.only(children);
    // map other properties and most importantly, reference to the inner DOM component
    const updatedChildren = React.Children.map(children, (child) => {
      const additionalProps = {
        ...props,
        ...others,
      };
      if (typeof child.type === 'function') {
        // if the Tooltip is attaching to another React Component
        // the inner React Component MUST handle the passing of the ref on its own (as well as spread other props (most importantly the events)
        return React.cloneElement(child, {
          innerRef: this.target,
          ...additionalProps,
        });
      } else {
        // or an HTML node
        return React.cloneElement(child, {
          ref: this.target,
          ...additionalProps,
        });
      }
    });
    return (
      <React.Fragment>
        {updatedChildren}
        {showTip && (
          <Tooltip
            direction={direction}
            className={tooltipClassName}
            content={content}
            background={background}
            color={color}
            padding={padding}
            eventToggle={eventToggle}
            useHover={useHover}
            useDefaultStyles={useDefaultStyles}
            tipContentHover={tipContentHover}
            arrow={arrow}
            arrowSize={arrowSize}
            distance={distance}
            target={this.target.current}
          />
        )}
      </React.Fragment>
    );
  }
}

export default AttachedTooltip;
