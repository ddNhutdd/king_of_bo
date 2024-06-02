import React from 'react'

function ProfileNewCard(props) {
	const {
		title,
		children,
		className
	} = props;
	return (
		<div className={`profile-new-card ${className}`}>
			<div className='title'>
				{title}
			</div>
			<div className='content'>
				{children}
			</div>
		</div>
	)
}

export default ProfileNewCard