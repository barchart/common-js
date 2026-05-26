const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object');

const DataProvider = require('./DataProvider'),
	DataProviderFactory = require('./DataProviderFactory'),
	ResultProcessor = require('./ResultProcessor');

const AddResultProcessor = require('./processors/AddResultProcessor'),
	AverageResultProcessor = require('./processors/AverageResultProcessor'),
	CleanResultProcessor = require('./processors/CleanResultProcessor'),
	CoalesceResultProcessor = require('./processors/CoalesceResultProcessor'),
	CompactResultProcessor = require('./processors/CompactResultProcessor'),
	CompositeResultProcessor = require('./processors/CompositeResultProcessor'),
	ConcatenateArrayResultProcessor = require('./processors/ConcatenateArrayResultProcessor'),
	ConcatenateResultProcessor = require('./processors/ConcatenateResultProcessor'),
	ConvertResultProcessor = require('./processors/ConvertResultProcessor'),
	CopyResultProcessor = require('./processors/CopyResultProcessor'),
	CountResultProcessor = require('./processors/CountResultProcessor'),
	DateResultProcessor = require('./processors/DateResultProcessor'),
	DateParseResultProcessor = require('./processors/DateParseResultProcessor'),
	DebugResultProcessor = require('./processors/DebugResultProcessor'),
	DefaultResultProcessor = require('./processors/DefaultResultProcessor'),
	DeleteResultProcessor = require('./processors/DeleteResultProcessor'),
	DistinctResultProcessor = require('./processors/DistinctResultProcessor'),
	DivideResultProcessor = require('./processors/DivideResultProcessor'),
	EmptyCoalescingResultProcessor = require('./processors/EmptyCoalescingResultProcessor'),
	EncodeUriResultProcessor = require('./processors/EncodeUriResultProcessor'),
	EpochResultProcessor = require('./processors/EpochResultProcessor'),
	ExtractResultProcessor = require('./processors/ExtractResultProcessor'),
	FilterComparisonResultProcessor = require('./processors/FilterComparisonResultProcessor'),
	FilterContainsResultProcessor = require('./processors/FilterContainsResultProcessor'),
	FilterEqualsResultProcessor = require('./processors/FilterEqualsResultProcessor'),
	FilterExistsResultProcessor = require('./processors/FilterExistsResultProcessor'),
	FilterOptionsResultProcessor = require('./processors/FilterOptionsResultProcessor'),
	FilterRegexResultProcessor = require('./processors/FilterRegexResultProcessor'),
	FilterResultProcessor = require('./processors/FilterResultProcessor'),
	FindResultProcessor = require('./processors/FindResultProcessor'),
	FirstResultProcessor = require('./processors/FirstResultProcessor'),
	FlattenResultProcessor = require('./processors/FlattenResultProcessor'),
	FormatDateResultProcessor = require('./processors/FormatDateResultProcessor'),
	FormatNumberResultProcessor = require('./processors/FormatNumberResultProcessor'),
	FormatPriceResultProcessor = require('./processors/FormatPriceResultProcessor'),
	GroupingResultProcessor = require('./processors/GroupingResultProcessor'),
	IndexResultProcessor = require('./processors/IndexResultProcessor'),
	JoinResultProcessor = require('./processors/JoinResultProcessor'),
	JsonParseResultProcessor = require('./processors/JsonParseResultProcessor'),
	JsonStringifyResultProcessor = require('./processors/JsonStringifyResultProcessor'),
	LowercaseResultProcessor = require('./processors/LowercaseResultProcessor'),
	MapResultProcessor = require('./processors/MapResultProcessor'),
	MatchResultProcessor = require('./processors/MatchResultProcessor'),
	MultiplyResultProcessor = require('./processors/MultiplyResultProcessor'),
	MySqlBlobToArrayProcessor = require('./processors/MySqlBlobToArrayProcessor'),
	NullCoalescingResultProcessor = require('./processors/NullCoalescingResultProcessor'),
	OverwriteResultProcessor = require('./processors/OverwriteResultProcessor'),
	PartitionResultProcessor = require('./processors/PartitionResultProcessor'),
	PositionResultProcessor = require('./processors/PositionResultProcessor'),
	PushResultProcessor = require('./processors/PushResultProcessor'),
	RangeIntersectionResultProcessor = require('./processors/RangeIntersectionResultProcessor'),
	ReplaceResultProcessor = require('./processors/ReplaceResultProcessor'),
	ScalarResultProcessor = require('./processors/ScalarResultProcessor'),
	SelectResultProcessor = require('./processors/SelectResultProcessor'),
	SignResultProcessor = require('./processors/SignResultProcessor'),
	SliceResultProcessor = require('./processors/SliceResultProcessor'),
	SortResultProcessor = require('./processors/SortResultProcessor'),
	SplitResultProcessor = require('./processors/SplitResultProcessor'),
	SubtractResultProcessor = require('./processors/SubtractResultProcessor'),
	SumResultProcessor = require('./processors/SumResultProcessor'),
	TranslateResultProcessor = require('./processors/TranslateResultProcessor'),
	TreeResultProcessor = require('./processors/TreeResultProcessor'),
	UnitConversionResultProcessor = require('./processors/UnitConversionResultProcessor'),
	TrimResultProcessor = require('./processors/TrimResultProcessor'),
	UnwrapResultProcessor = require('./processors/UnwrapResultProcessor'),
	UppercaseResultProcessor = require('./processors/UppercaseResultProcessor'),
	WrapResultProcessor = require('./processors/WrapResultProcessor'),

	ApiQueryProvider = require('./providers/ApiQueryProvider'),
	BackoffQueryProvider = require('./providers/BackoffQueryProvider'),
	ContextQueryProvider = require('./providers/ContextQueryProvider'),
	EnvironmentQueryProvider = require('./providers/EnvironmentQueryProvider'),
	HardcodeQueryProvider = require('./providers/HardcodeQueryProvider'),
	MySqlQueryProvider = require('./providers/MySqlQueryProvider'),
	OnDemandQueryProvider = require('./providers/OnDemandQueryProvider'),
	RestQueryProvider = require('./providers/RestQueryProvider'),
	SystemQueryProvider = require('./providers/SystemQueryProvider'),
	TimestampQueryProvider = require('./providers/TimestampQueryProvider');

module.exports = (() => {
	'use strict';

	const providerMap = {
		ApiQueryProvider: ApiQueryProvider,
		BackoffQueryProvider: BackoffQueryProvider,
		ContextQueryProvider: ContextQueryProvider,
		EnvironmentQueryProvider: EnvironmentQueryProvider,
		HardcodeQueryProvider: HardcodeQueryProvider,
		MySqlQueryProvider: MySqlQueryProvider,
		OnDemandQueryProvider: OnDemandQueryProvider,
		RestQueryProvider: RestQueryProvider,
		SystemQueryProvider: SystemQueryProvider,
		TimestampQueryProvider: TimestampQueryProvider,
	};

	const processorMap = {
		AddResultProcessor: AddResultProcessor,
		AverageResultProcessor: AverageResultProcessor,
		CleanResultProcessor: CleanResultProcessor,
		CoalesceResultProcessor: CoalesceResultProcessor,
		CompactResultProcessor: CompactResultProcessor,
		ConcatenateArrayResultProcessor: ConcatenateArrayResultProcessor,
		ConcatenateResultProcessor: ConcatenateResultProcessor,
		ConvertResultProcessor: ConvertResultProcessor,
		CopyResultProcessor: CopyResultProcessor,
		CountResultProcessor: CountResultProcessor,
		DateResultProcessor: DateResultProcessor,
		DateParseResultProcessor: DateParseResultProcessor,
		DebugResultProcessor: DebugResultProcessor,
		DefaultResultProcessor: DefaultResultProcessor,
		DeleteResultProcessor: DeleteResultProcessor,
		DistinctResultProcessor: DistinctResultProcessor,
		DivideResultProcessor: DivideResultProcessor,
		EmptyCoalescingResultProcessor: EmptyCoalescingResultProcessor,
		EncodeUriResultProcessor: EncodeUriResultProcessor,
		EpochResultProcessor: EpochResultProcessor,
		ExtractResultProcessor: ExtractResultProcessor,
		FilterComparisonResultProcessor: FilterComparisonResultProcessor,
		FilterContainsResultProcessor: FilterContainsResultProcessor,
		FilterEqualsResultProcessor: FilterEqualsResultProcessor,
		FilterExistsResultProcessor: FilterExistsResultProcessor,
		FilterOptionsResultProcessor: FilterOptionsResultProcessor,
		FilterRegexResultProcessor: FilterRegexResultProcessor,
		FilterResultProcessor: FilterResultProcessor,
		FindResultProcessor: FindResultProcessor,
		FirstResultProcessor: FirstResultProcessor,
		FlattenResultProcessor: FlattenResultProcessor,
		FormatDateResultProcessor: FormatDateResultProcessor,
		FormatNumberResultProcessor: FormatNumberResultProcessor,
		FormatPriceResultProcessor: FormatPriceResultProcessor,
		GroupingResultProcessor: GroupingResultProcessor,
		IndexResultProcessor: IndexResultProcessor,
		JoinResultProcessor: JoinResultProcessor,
		JsonParseResultProcessor: JsonParseResultProcessor,
		JsonStringifyResultProcessor: JsonStringifyResultProcessor,
		LowercaseResultProcessor: LowercaseResultProcessor,
		MapResultProcessor: MapResultProcessor,
		MatchResultProcessor: MatchResultProcessor,
		MultiplyResultProcessor: MultiplyResultProcessor,
		MySqlBlobToArrayProcessor: MySqlBlobToArrayProcessor,
		NullCoalescingResultProcessor: NullCoalescingResultProcessor,
		OverwriteResultProcessor: OverwriteResultProcessor,
		PartitionResultProcessor: PartitionResultProcessor,
		PositionResultProcessor: PositionResultProcessor,
		PushResultProcessor: PushResultProcessor,
		RangeIntersectionResultProcessor: RangeIntersectionResultProcessor,
		ReplaceResultProcessor: ReplaceResultProcessor,
		ScalarResultProcessor: ScalarResultProcessor,
		SelectResultProcessor: SelectResultProcessor,
		SignResultProcessor: SignResultProcessor,
		SliceResultProcessor: SliceResultProcessor,
		SortResultProcessor: SortResultProcessor,
		SplitResultProcessor: SplitResultProcessor,
		SubtractResultProcessor: SubtractResultProcessor,
		SumResultProcessor: SumResultProcessor,
		TranslateResultProcessor: TranslateResultProcessor,
		TreeResultProcessor: TreeResultProcessor,
		UnitConversionResultProcessor: UnitConversionResultProcessor,
		TrimResultProcessor: TrimResultProcessor,
		UnwrapResultProcessor: UnwrapResultProcessor,
		UppercaseResultProcessor: UppercaseResultProcessor,
		WrapResultProcessor: WrapResultProcessor,
		Default: ResultProcessor
	};

	class SimpleDataProviderFactory extends DataProviderFactory {
		constructor(customProcessors, customProviders, processorDefaults, providerDefaults) {
			super();

			this._customProcessors = customProcessors || {};
			this._customProviders = customProviders || {};

			this._processorDefaults = processorDefaults || {};
			this._providerDefaults = providerDefaults || {};
		}

		_build(configuration) {
			assert.argumentIsRequired(configuration, 'configuration', Object);
			assert.argumentIsRequired(configuration.provider, 'configuration.provider', Object);
			assert.argumentIsRequired(configuration.provider.type, 'configuration.provider.type', String);

			let queryProvider = buildQueryProvider.call(this, configuration.provider);
			let resultProcessor;

			if (is.array(configuration.processors)) {
				resultProcessor = new CompositeResultProcessor(configuration.processors.map((configuration) => {
					return buildResultProcessor.call(this, configuration);
				}));
			} else if (is.object(configuration.processor)) {
				resultProcessor = buildResultProcessor.call(this, configuration.processor);
			} else {
				resultProcessor = buildResultProcessor.call(this);
			}

			return new DataProvider(queryProvider, resultProcessor);
		}

		toString() {
			return '[SimpleDataProviderFactory]';
		}
	}

	function buildResultProcessor(processorConfiguration) {
		let processorTypeName;

		if (processorConfiguration) {
			processorTypeName = processorConfiguration.type;
		}

		if (!processorTypeName) {
			processorTypeName = 'Default';
		}

		if (!processorMap.hasOwnProperty(processorTypeName) && !this._customProcessors.hasOwnProperty(processorTypeName)) {
			throw new Error(`Unable to construct result processor (${processorTypeName})`);
		}

		const Constructor = processorMap[processorTypeName] || this._customProcessors[processorTypeName];

		return new Constructor(mergeConfigurations(this._processorDefaults[processorTypeName] || {}, processorConfiguration));
	}

	function buildQueryProvider(configuration) {
		const providerTypeName = configuration.type;

		if (!providerMap.hasOwnProperty(providerTypeName) && !this._customProviders.hasOwnProperty(providerTypeName)) {
			throw new Error(`Unable to construct query provider (${providerTypeName})`);
		}

		const nestedProviderConfiguration = configuration.nestedProvider;

		let nestedProvider;

		if (is.object(nestedProviderConfiguration) && is.string(nestedProviderConfiguration.type)) {
			nestedProvider = buildQueryProvider.call(this, nestedProviderConfiguration);
		} else {
			nestedProvider = undefined;
		}

		const Constructor = providerMap[providerTypeName] || this._customProviders[providerTypeName];

		return new Constructor(mergeConfigurations(this._providerDefaults[providerTypeName] || {}, configuration), nestedProvider);
	}

	function mergeConfigurations(defaultConfiguration, providerConfiguration) {
		return object.merge(defaultConfiguration, providerConfiguration);
	}

	return SimpleDataProviderFactory;
})();
