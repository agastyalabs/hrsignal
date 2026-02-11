import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeSizeParam,
  normalizePricingMetricParam,
  normalizeDeploymentParam,
  normalizeEvidenceParam,
  mapSizeBucketToLegacyBands,
  deploymentToPrismaEnum,
  pricingTypeToMetric,
} from '../lib/filters/taxonomy.ts';

test('normalizeSizeParam: maps legacy ranges to taxonomy buckets', () => {
  assert.equal(normalizeSizeParam('11-50'), 'smb');
  assert.equal(normalizeSizeParam('51-200'), 'smb');
  assert.equal(normalizeSizeParam('501-1000'), 'mid');
  assert.equal(normalizeSizeParam('10000+'), 'enterprise');
});

test('mapSizeBucketToLegacyBands: stable mapping', () => {
  assert.deepEqual(mapSizeBucketToLegacyBands('smb'), ['EMP_20_200']);
  assert.deepEqual(mapSizeBucketToLegacyBands('mid'), ['EMP_100_1000']);
  assert.deepEqual(mapSizeBucketToLegacyBands('enterprise'), ['EMP_100_1000']);
});

test('normalizePricingMetricParam: accepts legacy pricing types', () => {
  assert.equal(normalizePricingMetricParam('per_employee_month'), 'pepm');
  assert.equal(normalizePricingMetricParam('quote-based'), 'quote_based');
  assert.equal(normalizePricingMetricParam('one-time'), 'one_time');
});

test('normalizeDeploymentParam: normalizes common values', () => {
  assert.equal(normalizeDeploymentParam('CLOUD'), 'cloud');
  assert.equal(normalizeDeploymentParam('on-prem'), 'onprem');
  assert.equal(normalizeDeploymentParam('HYBRID'), 'hybrid');
});

test('deploymentToPrismaEnum', () => {
  assert.equal(deploymentToPrismaEnum('cloud'), 'CLOUD');
  assert.equal(deploymentToPrismaEnum('onprem'), 'ONPREM');
  assert.equal(deploymentToPrismaEnum('hybrid'), 'HYBRID');
});

test('normalizeEvidenceParam', () => {
  assert.equal(normalizeEvidenceParam('verified'), 'verified');
  assert.equal(normalizeEvidenceParam('needs_validation'), 'needs_validation');
  assert.equal(normalizeEvidenceParam('0'), 'needs_validation');
});

test('pricingTypeToMetric', () => {
  assert.equal(pricingTypeToMetric('per_employee_month'), 'pepm');
  assert.equal(pricingTypeToMetric('one_time'), 'one_time');
  assert.equal(pricingTypeToMetric('quote_based'), 'quote_based');
});
