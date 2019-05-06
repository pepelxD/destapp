import React from 'react';
import ReactDOM from 'react-dom';

const loadComponet = component => {
    import(`./${component}`)
        .then(({ default: component }) => component)
        .catch(error => console.error(error));
};

class Modal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true
        };
        this.closeComponent = this.closeComponent.bind(this);
        this.openComponent = this.openComponent.bind(this);
    }
    closeComponent() {
        this.setState({isOpen: false});
    }
    openComponent() {
        this.setState({isOpen: true});
    }
    componentDidMount() {
        console.log(this.props.triggers);
        this.props.triggers.forEach((trigger) => { 
            trigger.addEventListener('click', this.openComponent);
        });
    }
    componentWillUnmount() {
        
    }
    render() {
        return (
            this.state.isOpen &&
            <div className="application-form">
                <button onClick={this.closeComponent}>X</button>
                {this.props.children}
            </div>
        );
    }
}

export default function(clanName, triggers, component) {
    import(`./${component}`)
        .then(({ default: Component }) => {
            ReactDOM.render(
                <Modal clanName = {clanName} triggers = {triggers}><Component /></Modal>, 
                document.querySelector('.dinamic-content')
            );
        })
    //ReactDOM.render(<Modal clanName = {clanName} triggers = {triggers}> Co </Modal>, document.querySelector('.dinamic-content'));
}

