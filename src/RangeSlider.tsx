import * as React from "react";

type NumberPair = [number, number];

interface Props {
  range: NumberPair;
  step: number;
  values: NumberPair;
  onChange: (values: NumberPair) => void;
}

interface State {
  dragging: "left" | "right" | false;
}

interface StyleFunc {
  (value: number): React.CSSProperties;
}

export default class RangeSlider extends React.Component<Props, State> {
  trackRef: HTMLDivElement = null;

  state: State = {
    dragging: false
  };

  setTrackRef = (ref: HTMLDivElement) => (this.trackRef = ref);

  getPosition = (value: number) => {
    const [left, right] = this.props.range;
    return this.trackRef.offsetWidth * (value - left) / (right - left);
  };

  getStyle: StyleFunc = (value: number) => {
    return this.trackRef
      ? {
          transform: `translateX(${this.getPosition(value)}px)`
        }
      : { display: "none" };
  };

  shouldUpdate = (newValues: NumberPair) => {
    const { range, values } = this.props;
    const reverse = range[0] > range[1];
    return (
      (Math.abs(values[0] - newValues[0]) >= (Number as any).EPSILON ||
        Math.abs(values[1] - newValues[1]) >= (Number as any).EPSILON) &&
      ((reverse && newValues[0] >= newValues[1]) ||
        (!reverse && newValues[0] <= newValues[1]))
    );
  };

  handleLeftHandleMouseDown = () => {
    document.addEventListener("mousemove", this.handleMouseMove);
    this.setState({ dragging: "left" });
  };

  handleRightHandleMouseDown = () => {
    document.addEventListener("mousemove", this.handleMouseMove);
    this.setState({ dragging: "right" });
  };

  handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleMouseMove);
    this.setState({ dragging: false });
  };

  handleMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    const {
      range: [left, right],
      step,
      values: [valueLeft, valueRight]
    } = this.props;
    const { dragging } = this.state;
    const position = event.clientX - this.trackRef.getBoundingClientRect().left;

    const rawValue =
      position * (right - left) / this.trackRef.offsetWidth + left;

    const min = Math.min(left, right);
    const max = Math.max(left, right);

    const value = Math.min(
      max,
      Math.max(min, left + step * Math.round((rawValue - left) / step))
    );
    console.log(rawValue, min, max, value);

    const newValues: NumberPair =
      dragging === "left" ? [value, valueRight] : [valueLeft, value];

    if (this.shouldUpdate(newValues)) {
      this.props.onChange(newValues);
    }
  };

  handleResize = () => this.forceUpdate();

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("resize", this.handleResize);
    this.forceUpdate();
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("resize", this.handleResize);
  }

  render() {
    const { values } = this.props;

    return (
      <div className="react-drs">
        <div className="react-drs_track" ref={this.setTrackRef}>
          <div className="react-drs_dot react-drs_right-dot" />
          <div className="react-drs_dot react-drs_left-dot" />
          <div
            className="react-drs_handle"
            style={this.getStyle(values[0])}
            onMouseDown={this.handleLeftHandleMouseDown}
          />
          <div
            className="react-drs_handle"
            style={this.getStyle(values[1])}
            onMouseDown={this.handleRightHandleMouseDown}
          />
        </div>
      </div>
    );
  }
}
