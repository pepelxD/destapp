import React from 'react';

class ApplyForm extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <form action="#" method="POST">
                <p> Для подачи заявки необходимо запонить форму </p>
                <input type="hidden" name="clanname" value={this.props.clanName} />
                <label htmlFor="name"> Имя </label>
                <input type="text" name="name" id="name" />
                <label htmlFor="name"> Ник в игре </label>
                <input type="text" name="nicname" id="nicname" />
                <label htmlFor="class"> Профа основы </label>
                <input type="text" name="class" id="class" />
                <label htmlFor="message"> Расскажите немного о себе, почему выбрали наш клан и укажите как с Вами можно связаться </label>
                <textarea name="message" id="message" />
                <input type="submit" value="Отправить" />
            </form>
        )
    }
}

export default ApplyForm;