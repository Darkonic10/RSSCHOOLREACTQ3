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

  componentDidMount() {
    const savedSearch = localStorage.getItem('lastSearch') ?? '';
    this.setState({ searchValue: savedSearch });
    this.props.onSearch(savedSearch);
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: event.target.value.trim() });
  };

  handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { searchValue } = this.state;
    localStorage.setItem('lastSearch', searchValue);
    this.props.onSearch(searchValue);
  };

  render() {
    return (
      <header className={styles.header}>
        <form className={styles.headerForm} onSubmit={this.handleSearch}>
          <CustomInput
            placeholder="Search by title"
            name="Search"
            value={this.state.searchValue}
            onChange={this.handleInputChange}
          />
          <CustomButton type="submit">Search</CustomButton>
        </form>
      </header>
    );
  }
}

export default HeaderComponent;
