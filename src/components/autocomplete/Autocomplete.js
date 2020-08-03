import React, { Component } from "react";
import PropTypes from "prop-types";
import "./autocomplete.scss";

export class Autocomplete extends Component {
  static propTypes = {
    options: PropTypes.instanceOf(Array).isRequired,
  };
  state = {
    activeOption: 0,
    filteredOptions: [],
    showOptions: false,
    userInput: "",
  };

  onChange = (e) => {
    const { options } = this.props;
    const userInput = e.currentTarget.value;

    const filteredOptions = options.filter(
      (optionName) =>
        optionName.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeOption: 0,
      filteredOptions,
      showOptions: true,
      userInput: e.currentTarget.value,
    });

    this.props.setGuess(e.currentTarget.value);
    this.props.checkValidGuess();
  };

  onClick = (e) => {
    this.setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: e.currentTarget.innerText,
    });

    this.props.setGuess(e.currentTarget.innerText);
    this.props.checkValidGuess();
  };

  onKeyDown = (e) => {
    const { activeOption, filteredOptions } = this.state;

    if (e.keyCode === 13) {
      if (this.state.showOptions) {
        this.setState({
          activeOption: 0,
          showOptions: false,
          userInput: filteredOptions[activeOption],
        });
        this.props.setGuess(filteredOptions[activeOption]);
        this.props.checkValidGuess();
      } else {
        this.props.activateGuess();
      }
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return;
      }
      this.setState({ activeOption: activeOption - 1 });
    } else if (e.keyCode === 40) {
      if (activeOption === filteredOptions.length - 1) {
        return;
      }
      this.setState({ activeOption: activeOption + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: { activeOption, filteredOptions, showOptions, userInput },
    } = this;

    let optionList;

    if (showOptions && userInput) {
      if (filteredOptions.length) {
        optionList = (
          <ul className="options">
            {filteredOptions.map((optionName, index) => {
              let className;
              if (index === activeOption) {
                className = "option-active";
              }
              return (
                <li className={className} key={optionName} onClick={onClick}>
                  {optionName}
                </li>
              );
            })}
          </ul>
        );
      } else {
        optionList = <span className="no-options">No matches found.</span>;
      }
    }

    return (
      <>
        <div className="search">
          <input
            autoFocus
            type="text"
            className="search-box"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />
          {optionList}
        </div>
      </>
    );
  }
}

export default Autocomplete;
