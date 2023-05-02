import React from "react";
import styled from "styled-components";

const ButtonComponent = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justfy-content: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border-radius: 0.3rem;
  margin-right: "10px";
  padding: 0
    ${(props) =>
      props.size === "sm"
        ? "1.1rem"
        : props.size === "md"
        ? "1.4rem"
        : props.size === "lg"
        ? "1.6rem"
        : "1.1rem"};
  height: ${(props) =>
    props.size === "sm"
      ? "34px"
      : props.size === "md"
      ? "37px"
      : props.size === "lg"
      ? "45px"
      : "45px"};
  font-family: "Inter", sans-serif;
  font-weight: 500;
  border: 1px solid transparent;
  background-color: ${(props) =>
    props.variant === "light"
      ? "#f8f9fa"
      : props.variant === "dark"
      ? "#212529"
      : props.variant === "primary"
      ? "#0d6efd"
      : props.variant === "secondary"
      ? "#6c757d"
      : props.variant === "success"
      ? "#198754"
      : props.variant === "info"
      ? "#0dcaf0"
      : props.variant === "warning"
      ? "#ffc107"
      : props.variant === "danger"
      ? "#dc3545"
      : "#f8f9fa"};
  color: ${(props) =>
    props.variant === "light"
      ? "#212529"
      : props.variant === "dark"
      ? "#ffffff"
      : props.variant === "primary"
      ? "#ffffff"
      : props.variant === "secondary"
      ? "#ffffff"
      : props.variant === "success"
      ? "#ffffff"
      : props.variant === "info"
      ? "#ffffff"
      : props.variant === "warning"
      ? "#ffffff"
      : props.variant === "danger"
      ? "#ffffff"
      : "#212529"};
`;

const Button = ({ type, variant, className, id, onClick, size, children }) => {
  return (
    <ButtonComponent
      type={type ? type : "button"}
      variant={variant}
      className={className ? `btn-component ${className}` : "btn-component"}
      id={id}
      onClick={onClick}
      size={size}
    >
      {children}
    </ButtonComponent>
  );
};

export default Button;

/*
import './Button.css';

const Button = props => {
    const {title, onClick, isLoading} = props;

    return (
        <>
            <button className='button' onClick={onClick}>{isLoading ? 'loading' : title}</button>
        </>
    )
}

export default Button;
*/
