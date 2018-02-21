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

function isEqual(a: number, b: number) {
  return Math.abs(a - b) < (Number as any).EPSILON;
}

export default class RangeSlider extends React.Component<Props, State> {
  trackRef: HTMLDivElement = null;

  state: State = {
    dragging: false
  };

  setTrackRef = (ref: HTMLDivElement) => (this.trackRef = ref);

  getPosition = (value: number) => {
    const width = this.trackRef.offsetWidth;
    const { range: [min, max] } = this.props;
    return width * (value - min) / (max - min);
  };

  getStyle: StyleFunc = (value: number) => {
    return this.trackRef
      ? {
          transform: `translateX(${this.getPosition(value)}px)`
        }
      : { display: "none" };
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
      range: [min, max],
      step,
      values: [valueLeft, valueRight]
    } = this.props;
    const { dragging } = this.state;
    const width = this.trackRef.offsetWidth;
    const position = event.clientX - this.trackRef.getBoundingClientRect().left;

    const rawValue = position * (max - min) / width + min;
    const value = Math.min(
      max,
      Math.max(min, min + step * Math.round((rawValue - min) / step))
    );

    if (
      dragging === "left" &&
      !isEqual(valueLeft, value) &&
      value <= valueRight
    ) {
      this.props.onChange([value, valueRight]);
    } else if (
      dragging === "right" &&
      !isEqual(valueRight, value) &&
      value >= valueLeft
    ) {
      this.props.onChange([valueLeft, value]);
    }
  };

  handleResize = () => {
    this.forceUpdate();
  };

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("resize", this.handleResize);
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
