import React, { useState } from 'react';
import InputWidthImage from './InputWithImage';
import ButtonCustom, { buttonType } from './ButtonCustom';
import AlertCustom from './AlertCustom';
import InputWithTitle from './InputWithTitle';
import blueStick from '../assets/img/blue-tick.png';
import { useTranslation } from "react-i18next";

const networkType = {
	internal: 'internal',
	bep20: 'bep20'
}

function WalletNewWithdraw() {
	// đa ngôn ngữ 
	const { t } = useTranslation();

	// usdt input
	const [usdtValue, setUsdtValue] = useState('');
	const usdtValueChangeHandle = (ev) => {
		setUsdtValue(ev.target.value)
	}

	// network
	const [networkSelected, setNetworkSelected] = useState(networkType.internal);
	const networkClickHandle = (network) => {
		setNetworkSelected(network)
	}
	const renderButtonType = (network) => {
		return network === networkSelected ? buttonType.active : buttonType.unActive;
	}
	const renderActiveButtonNetwork = (network) => {
		return network === networkSelected ? 'active' : '';
	}

	return (
		<div className='wallet-new-withdraw'>
			<div className='input-image'>
				<InputWidthImage />
			</div>
			<div className='network'>
				{t('network')}
			</div>
			<div className='row-action'>
				<div className='action-item'>
					<ButtonCustom
						type={renderButtonType(networkType.internal)}
						onClick={networkClickHandle.bind(null, networkType.internal)}
					>
						<div className={`top ${renderActiveButtonNetwork(networkType.internal)}`}>
							{t('internal')}
						</div>
						<div className={`bot ${renderActiveButtonNetwork(networkType.internal)}`}>
							{t('feefee')}: 0 USDT
						</div>
					</ButtonCustom>
					<img
						src={blueStick} alt="dk"
						className={renderActiveButtonNetwork(networkType.internal)}
					/>
				</div>
				<div className='action-item'>
					<ButtonCustom
						onClick={networkClickHandle.bind(null, networkType.bep20)}
						type={renderButtonType(networkType.bep20)}
					>
						<div className={`top ${renderActiveButtonNetwork(networkType.bep20)}`}>
							BEP20 (BSC)
						</div>
						<div className='bot fee'>
							{t('feefee')}: 1 USDT
						</div>
					</ButtonCustom>
					<img
						src={blueStick} alt="dk"
						className={renderActiveButtonNetwork(networkType.bep20)}
					/>
				</div>
			</div>
			<div className='note'>
				<AlertCustom>
					{t('note')}: {t('forTheSafetyOfYourFundsPleaseConfirmAgainThatTheBlockchainYouWishToUseIsBSC')}
				</AlertCustom>
			</div>
			<div className='input-container'>
				<InputWithTitle
					title={t('usdtAmount')}
					inputValue={usdtValue}
					inputOnChange={usdtValueChangeHandle}
					placeholder={t('minimumAmount5USDT')}
				>
					<ButtonCustom
						type={buttonType.active}
						style={{
							padding: '2px 5px',
							fontSize: 16,
							border: 0,
							whiteSpace: 'nowrap'
						}}
					>
						{t('max')}
					</ButtonCustom>
				</InputWithTitle>
			</div>
			<div className='input-container'>
				<InputWithTitle
					title={t('recipientNickname')}
					inputValue={usdtValue}
					inputOnChange={usdtValueChangeHandle}
					placeholder={t('enterRecipientNickname')}
				>
					<span className='paste-text'>
						{t('paste')}
					</span>
				</InputWithTitle>
			</div>
			<div className='input-container'>
				<InputWithTitle
					title={t('memoOptional')}
					inputValue={usdtValue}
					inputOnChange={usdtValueChangeHandle}
					placeholder={t('enterYourMessage')}
				>
					<span className='paste-text'>
						{t('paste')}
					</span>
				</InputWithTitle>
			</div>
			<div className='widthraw'>
				<div className='note'>
					{t('youMustEnable2FAToMakeWithdrawalRequests')}
				</div>
				<ButtonCustom
					type={buttonType.shineRed}
					style={{
						padding: '11px 15px',
						maxWidth: '230px',
					}}
				>
					{t('send')}
				</ButtonCustom>
			</div>
		</div >
	)
}

export default WalletNewWithdraw