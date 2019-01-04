/**
 * @class TooltipElement
 * @description The container of a lightweight and responsive tooltip.
 */
import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from './Tooltip';

class TooltipElement extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    tagName: PropTypes.string,
    direction: PropTypes.string,
    className: PropTypes.string,
    tooltipClassName: PropTypes.string,
    content: PropTypes.node.isRequired,
    background: PropTypes.string,
    color: PropTypes.string,
    padding: PropTypes.string,
    styles: PropTypes.object,
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
    tagName: 'div',
    direction: 'up',
    className: '',
    tooltipClassName: '',
    background: '',
    color: '',
    padding: '10px',
    styles: {},
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
      className,
      tooltipClassName,
      padding,
      children,
      content,
      styles,
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
      tagName: TagName,
      ...others
    } = this.props;
    delete others.hoverDelay;

    const showTip = (typeof isOpen === 'undefined') ? this.state.showTip : isOpen;

    const wrapperStyles = {
      position: 'relative',
      ...styles,
    };

    const props = {
      style: wrapperStyles,
      ref: this.target,
      className,
    };

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
    return (
      <TagName {...others} {...props}>
        {children}
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
      </TagName>
    );
  }
}

export default TooltipElement;
