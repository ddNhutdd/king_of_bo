import React from 'react';

function InputGroup(props) {
	const {
		label,
		placeholder,
		error,
		disabled,
		id,
		name,
		onChange,
		value,
	} = props;

	return (
		<div className='input-group'>
			<label
				className='input-group-label'
			>
				{label}
			</label>
			<div
				className='input-group-input'
			>
				<input
					type='text'
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					disabled={disabled}
					id={id}
					name={name}
				/>
			</div>
			{
				error && <div
					className='input-group-error'
				>
					{error}
				</div>
			}
		</div>
	)
}

export default InputGroup