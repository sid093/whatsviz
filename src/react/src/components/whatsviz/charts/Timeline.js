import React from "react";
import { Line } from 'react-chartjs-2';
import { colorHasher, DEVICE_PIXEL_RATIO } from "./Common";

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();

        const data = {
            labels: this.props.data.labels,
            datasets: this.props.data.data.map(d => ({
                label: d.sender,
                data: d.counts,
                fill: false,
                backgroundColor: colorHasher(d.sender),
                borderColor: colorHasher(d.sender)
            }))
        };

        const options = {
            animation: false,
            devicePixelRatio: DEVICE_PIXEL_RATIO,
            scales: {
                yAxes: [
                    {
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ],
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Timeline'
                },
            }
        };

        this.state = { data, options };
    }

    ref = () => this.ref;

    render() {
        return <Line ref={this.ref} data={this.state.data} options={this.state.options} />
    }
}

export default Timeline;