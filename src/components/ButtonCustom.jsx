import React from 'react';


export const buttonType = {
	active: 'active',
	unActive: 'unActive',
	shineGreen: 'shineGreen',
	shineRed: 'shineRed'
}

export const buttonHtmlType = {
	submit: 'submit'
}

const renderType = (type) => {
	switch (type) {
		case buttonType.active:
			return buttonType.active;
		case buttonType.unActive:
			return buttonType.unActive;
		case buttonType.shineGreen:
			return buttonType.shineGreen;
		case buttonType.shineRed:
			return buttonType.shineRed;

		default:
			break;
	}
}

const renderDisabled = (disabled) => {
	return disabled ? 'disabled' : ''
}

function ButtonCustom(props) {
	const {
		type = buttonType.unActive,
		onClick = () => { },
		style,
		className,
		children,
		disabled = false,
		htmlType
	} = props;

	return (
		<button
			className={`buttonCustom ${renderType(type)} ${renderDisabled(disabled)} ${className}`}
			onClick={onClick}
			style={style}
			type={htmlType}
		>
			{children}
		</button >
	)
}

export default ButtonCustom