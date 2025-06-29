import React from 'react';
import styles from './header.component.module.css';
import CustomInput from '../ui/custom-input/custom-input.tsx';
import CustomButton from '../ui/custom-button/custom-button.tsx';
import { searchAnime } from '../../api/jikan.ts';

class HeaderComponent extends React.Component {
  state = {
    searchValue: '',
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: event.target.value });
  };

  handleSearch = async () => {
    const { searchValue } = this.state;
    console.log('Sending search request for:', searchValue);

    try {
      const responseData = await searchAnime(searchValue);
      console.log('Fetched data:', responseData);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  render() {
    return (
      <header className={styles.header}>
        <div className={styles.headerControlContainer}>
          <CustomInput
            placeholder="Search by title"
            name="Search"
            onChange={this.handleInputChange}
          />
          <CustomButton type="button" onClick={this.handleSearch}>
            Search
          </CustomButton>
        </div>
      </header>
    );
  }
}

export default HeaderComponent;
