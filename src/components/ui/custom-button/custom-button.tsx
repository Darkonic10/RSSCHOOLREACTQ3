import React, { type MouseEventHandler } from 'react';
import styles from './custom-button.module.css';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  isNeedError?: boolean;
}

class CustomButton extends React.Component<CustomButtonProps> {
  state = {
    shouldThrow: false,
  };

  handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { isNeedError, onClick } = this.props;

    if (isNeedError) {
      this.setState({ shouldThrow: true });
    } else if (onClick) {
      onClick(e);
    }
  };

  render() {
    const { children, type = 'button' } = this.props;

    if (this.state.shouldThrow) {
      throw new Error('💣 Simulated error in render after click!');
    }

    return (
      <button className={styles.button} type={type} onClick={this.handleClick}>
        {children}
      </button>
    );
  }
}

export default CustomButton;
