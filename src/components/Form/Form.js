import React, {Component} from 'react';
import {
  View
} from 'react-native'
import FormItem from './FormItem'

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  onChange(name, value) {
    this.props.onChange(name, value)
  }
  render() {
    const { fields }= this.props
    return (
      <View>
        { fields.map((field, index) => (
          <FormItem key={index} itemOptions={field} onChange={this.onChange.bind(this, field.name)} onClickMap={() => this.props.onClickMap()} mapValue={this.props.mapValue}/>
        ))
        }
      </View>
    )
  }
}

export default Form;