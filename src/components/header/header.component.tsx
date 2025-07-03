import React from 'react';
import styles from './header.component.module.css';
import CustomInput from '../ui/custom-input/custom-input.tsx';
import CustomButton from '../ui/custom-button/custom-button.tsx';

interface HeaderProps {
  onSearch: (query: string) => void;
}

interface HeaderState {
  searchValue: string;
}

class HeaderComponent extends React.Component<HeaderProps, HeaderState> {
  state: HeaderState = {
    searchValue: '',
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: event.target.value });
  };

  handleSearch = async () => {
    const { searchValue } = this.state;
    this.props.onSearch(searchValue);
  };

  render() {
    return (
      <header className={styles.header}>
        <div className={styles.headerControlContainer}>
          <CustomInput placeholder="Search by title" name="Search" onChange={this.handleInputChange} />
          <CustomButton type="button" onClick={this.handleSearch}>
            Search
          </CustomButton>
        </div>
      </header>
    );
  }
}

export default HeaderComponent;
