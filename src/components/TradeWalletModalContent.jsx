import React from 'react';
import ButtonCustom, { buttonType } from './ButtonCustom';
import VerticalTwoArrowIcon from '../assets/icons/vertical-two-arrow.icon';
import { useTranslation } from "react-i18next";
import { processString } from '../function/processString';

function TradeWalletModalContent() {
	// đa ngôn ngữ 
	const { t } = useTranslation();
	const renderUSDTWallet = () => {
		return processString(t('uSDTWallet'), ['USDT'], (matched) => {
			return <span>{matched}</span>
		})
	}

	return (
		<div className='trade-wallet-modal-content'>
			<div className='title'>
				{t('transfertransfer')}
			</div>
			<div className='item-container'>
				<div className='item'>
					<div className='name'>
						{renderUSDTWallet()}
					</div>
					<div className='value'>
						0
					</div>
				</div>
				<div className='item'>
					<div className='name'>
						{t('liveAccount')}
					</div>
					<div className='value'>
						0
					</div>
				</div>
				<div className='switch-button'>
					<VerticalTwoArrowIcon />
				</div>
			</div>
			<div className='input-container'>
				<div className='input'>
					<input
						type="text"
						placeholder='Nhập số tiền'
					/>
					<span>
						{t('all').toUpperCase()}
					</span>
				</div>
			</div>
			<div className='input-small-device'>
				<div className='title'>
					{t('transferAmount')}
				</div>
				<div className='content'>
					<input
						type="text"
						placeholder='Hãy nhập số lượng cần chuyển'
					/>
					<img
						src="https://kingofbo3.net/img/usdt.bb7c0bc3.svg"
						alt="dk"
					/>
					<div className='text'>
						{t('all').toUpperCase()}
					</div>
				</div>
			</div>
			<div className='note-container'>
				<div className='note'>
					{t('youCanOnlyTradeWhenAssetsAreTransferredToTheCorrespondingAccountTransfersBetweenAccountsAreFeeOfCharge')}
				</div>
			</div>
			<div className='action'>
				<ButtonCustom
					type={buttonType.active}
					style={{
						border: 0
					}}
				>
					{t('transfertransfer')}
				</ButtonCustom>
			</div>
		</div>
	)
}

export default TradeWalletModalContent