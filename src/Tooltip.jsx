/**
 * @class Tooltip
 * @description A lightweight and responsive tooltip.
 */
import React from 'react';
import PropTypes from 'prop-types';

import Portal from 'react-minimalist-portal';
import positions from './position';

// default colors
const defaultColor = '#fff';
const defaultBg = '#333';

const stopProp = e => e.stopPropagation();

class Tooltip extends React.PureComponent {
  static propTypes = {
    direction: PropTypes.string,
    className: PropTypes.string,
    content: PropTypes.node.isRequired,
    background: PropTypes.string,
    color: PropTypes.string,
    padding: PropTypes.string,
    eventToggle: PropTypes.string,
    useHover: PropTypes.bool,
    useDefaultStyles: PropTypes.bool,
    isOpen: PropTypes.bool,
    tipContentHover: PropTypes.bool,
    arrow: PropTypes.bool,
    arrowSize: PropTypes.number,
    distance: PropTypes.number,
    target: PropTypes.object,
  };
  static defaultProps = {
    direction: 'up',
    className: '',
    background: '',
    color: '',
    padding: '10px',
    useHover: true,
    useDefaultStyles: false,
    isOpen: false,
    tipContentHover: false,
    arrow: true,
    arrowSize: 10,
    distance: undefined,
  };

  constructor() {
    super();
    this.tip = React.createRef();
  }

  tip = null;

  render() {
    const {
      direction,
      className,
      padding,
      content,
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
      target,
    } = this.props;

    const currentPositions = positions(direction, this.tip.current, target, { ...this.state, showTip: isOpen }, {
      background: useDefaultStyles ? defaultBg : background,
      arrow,
      arrowSize,
      distance,
    });

    const tipStyles = {
      ...currentPositions.tip,
      background: useDefaultStyles ? defaultBg : background,
      color: useDefaultStyles ? defaultColor : color,
      padding,
      boxSizing: 'border-box',
      zIndex: 1000,
      position: 'absolute',
      display: 'inline-block',
    };

    const arrowStyles = {
      ...currentPositions.arrow,
      position: 'absolute',
      width: '0px',
      height: '0px',
      zIndex: 1001,
    };

    const portalProps = {
      // keep clicks on the tip from closing click controlled tips
      onClick: stopProp,
    };

    if (!eventToggle && useHover && tipContentHover) {
      portalProps.onMouseOver = this.startHover;
      portalProps.onMouseOut = this.endHover;
      portalProps.onTouchStart = stopProp;
    }

    return (
      <Portal>
        <div {...portalProps} className={className}>
          <span className="react-tooltip-lite" style={tipStyles} ref={this.tip}>
            {content}
          </span>
          <span className={`react-tooltip-lite-arrow react-tooltip-lite-${currentPositions.realDirection}-arrow`} style={arrowStyles} />
        </div>
      </Portal>
    );
  }
}

export default Tooltip;
