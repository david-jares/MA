import React, { useState } from 'react';
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap';

const MySettingSelectValueNumeric = ({ label, value, onChange, info }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue >= 1) {
      setInputValue(newValue);
      onChange(newValue);
    }
  };

  const handleDecreaseClick = () => {
    const newValue = inputValue - 1;
    if (newValue >= 1) {
      setInputValue(newValue);
      onChange(newValue);
    }
  };

  const handleIncreaseClick = () => {
    const newValue = inputValue + 1;
    setInputValue(newValue);
    onChange(newValue);
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Additional Information</Popover.Title>
      <Popover.Content>{info}</Popover.Content>
    </Popover>
  );

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <div className="d-flex align-items-center">
        <Button variant="outline-secondary" onClick={handleDecreaseClick}>
          -
        </Button>
        <Form.Control
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          className="mx-2"
        />
        <Button variant="outline-secondary" onClick={handleIncreaseClick}>
          +
        </Button>
        <OverlayTrigger trigger="click" placement="right" overlay={popover}>
          <Button variant="outline-secondary" className="ml-2">
            i
          </Button>
        </OverlayTrigger>
      </div>
    </Form.Group>
  );
};

export default MySettingSelectValueNumeric;