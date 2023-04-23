import React, { Component } from 'react';

class TagsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        labels: props.initialLabels || []
    };
  }

  handleAddLabel = (event) => {
    const { labels } = this.state;

    if (labels.includes(event.target.text)) {
        return; // don't add duplicate labels
      }

    this.setState({
        labels: [...labels, event.target.text]
    });
  }

  handleRemoveLabel = (index) => {
    const { labels } = this.state;
    this.setState({
      labels: labels.filter((label, i) => i !== index)
    });
  }

  render() {
    const { labels, newLabel } = this.state;

    return (
      <div class="d-grid gap-2 d-md-flex justify-content-md-begin">
        <label for="exampleFormControlTextarea1" class="form-label">Categories: </label>
        <div class="btn-group">
            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Select Categories</button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" onClick={this.handleAddLabel}>Action</a></li>
                <li><a class="dropdown-item" href="#" onClick={this.handleAddLabel}>Another action</a></li>
                <li><a class="dropdown-item" href="#" onClick={this.handleAddLabel}>Something else here</a></li>
            </ul>
        </div>
        <ul style={{ listStyle: 'none', padding: 5 }}>
            <div class="d-grid gap-2 d-md-flex justify-content-md-begin">
                {labels.map((label, index) => (
                    <li key={index}>
                    {label}
                    <button type="button" style={{ border: 'none', padding: 1 ,borderRadius: 10}} onClick={() => this.handleRemoveLabel(index)}>&times;</button>
                    </li>
                ))}
            </div>    
        </ul>
      </div>
    );
  }
}

export default TagsForm;
