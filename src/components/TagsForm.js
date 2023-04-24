import React, { Component } from 'react';

class TagsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        tags: props.initialLabels || [],
    };
  }

  handleAddTag = (event) => {
    const { tags} = this.state;
    const {onAddTag} = this.props;

    if (tags.includes(event.target.text)) {
        return; // don't add duplicate tags
      }

    this.setState({
        tags: [...tags, event.target.text]
    });

    onAddTag(event);
  }

  handleRemoveTag = (index) => {
    const { tags } = this.state;
    const {onRemoveTag} = this.props;
    this.setState({
      tags: tags.filter((tag, i) => i !== index)
    });

    onRemoveTag(index);
  }

  render() {
    const { tags } = this.state;

    return (
      <div class="d-grid gap-2 d-md-flex justify-content-md-begin">
        <label for="exampleFormControlTextarea1" class="form-label">Categories: </label>
        <div class="btn-group">
            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Select Categories</button>
            <ul class="dropdown-menu">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a class="dropdown-item" href="#" onClick={this.handleAddTag}>Books and Courses</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a class="dropdown-item" href="#" onClick={this.handleAddTag}>Cellphones and Smartwatches</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a class="dropdown-item" href="#" onClick={this.handleAddTag}>Computers and Electronics</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a class="dropdown-item" href="#" onClick={this.handleAddTag}>Gaming</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a class="dropdown-item" href="#" onClick={this.handleAddTag}>Home and Appliances</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a class="dropdown-item" href="#" onClick={this.handleAddTag}>TV, Audio and Media</a></li>
            </ul>
        </div>
        <ul style={{ listStyle: 'none', padding: 5 }}>
            <div class="d-grid gap-2 d-md-flex justify-content-md-begin">
                {tags.map((tag, index) => (
                    <li key={index}>
                    {tag}
                    <button type="button" style={{ border: 'none', padding: 1 ,borderRadius: 10}} onClick={() => this.handleRemoveTag(index)}>&times;</button>
                    </li>
                ))}
            </div>    
        </ul>
      </div>
    );
  }
}

export default TagsForm;
