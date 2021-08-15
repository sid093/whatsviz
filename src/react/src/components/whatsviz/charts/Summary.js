import React from "react";
import { Bar } from 'react-chartjs-2';
import { colorHasher, DEVICE_PIXEL_RATIO } from "./Common";

class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();

        const data = {
            labels: this.props.data.map(d => d.sender),
            datasets: [{
                label: '# of Messages',
                data: this.props.data.map(d => d.count),
                borderWidth: 1,
                backgroundColor: this.props.data.map(d => colorHasher(d.sender))
            },],
        };

        const options = {
            animation: false,
            devicePixelRatio: DEVICE_PIXEL_RATIO,
            indexAxis: 'y',
            elements: {
                bar: {
                    borderWidth: 2,
                },
            },
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Chat Summary',
                },
            },
        }

        this.state = { data, options };
    }

    ref = () => this.ref;

    render() {
        return <Bar ref={this.ref} data={this.state.data} options={this.state.options} />
    }
}

export default Summary;