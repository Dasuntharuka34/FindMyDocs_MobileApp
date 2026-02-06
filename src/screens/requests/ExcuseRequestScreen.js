import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import RequestItem from '../../components/RequestItem';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ExcuseRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { excuseRequests, fetchExcuseRequests, isLoading } = useRequests();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    await fetchExcuseRequests(user._id);
  };

  const filteredRequests = excuseRequests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'pending') return request.status !== 'Approved' && request.status !== 'Rejected';
    if (filter === 'approved') return request.status === 'Approved';
    if (filter === 'rejected') return request.status === 'Rejected';
    return true;
  });

  const handleRequestPress = (request) => {
    navigation.navigate('RequestDetail', {
      requestId: request._id,
      type: 'excuse'
    });
  };

  const handleNewRequest = () => {
    navigation.navigate('NewRequest');
  };

  const getStatusCounts = () => {
    const pending = excuseRequests.filter(req => req.status !== 'Approved' && req.status !== 'Rejected').length;
    const approved = excuseRequests.filter(req => req.status === 'Approved').length;
    const rejected = excuseRequests.filter(req => req.status === 'Rejected').length;

    return { pending, approved, rejected, total: excuseRequests.length };
  };

  const statusCounts = getStatusCounts();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header with Stats */}
      <Card theme={theme} style={{ margin: theme.spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: theme.typography.xl.fontSize, fontWeight: 'bold', color: theme.colors.primary }}>
              {statusCounts.total}
            </Text>
            <Text style={{ color: theme.colors.textSecondary }}>Total</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: theme.typography.xl.fontSize, fontWeight: 'bold', color: theme.colors.warning }}>
              {statusCounts.pending}
            </Text>
            <Text style={{ color: theme.colors.textSecondary }}>Pending</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: theme.typography.xl.fontSize, fontWeight: 'bold', color: theme.colors.success }}>
              {statusCounts.approved}
            </Text>
            <Text style={{ color: theme.colors.textSecondary }}>Approved</Text>
          </View>
        </View>
      </Card>

      {/* Filter Buttons */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md }}
      >
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          {['all', 'pending', 'approved', 'rejected'].map((filterType) => (
            <TouchableOpacity
              key={filterType}
              onPress={() => setFilter(filterType)}
              style={{
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.full,
                backgroundColor: filter === filterType ? theme.colors.primary : theme.colors.backgroundSecondary,
              }}
            >
              <Text style={{
                color: filter === filterType ? theme.colors.textInverse : theme.colors.textSecondary,
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {filterType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Requests List */}
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        {filteredRequests.length === 0 ? (
          <Card theme={theme} style={{ alignItems: 'center', padding: theme.spacing.xl }}>
            <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
              {excuseRequests.length === 0 ? 'No excuse requests yet' : `No ${filter} requests`}
            </Text>
            
            {excuseRequests.length === 0 && (
              <Button
                title="Create First Request"
                onPress={handleNewRequest}
                variant="primary"
              />
            )}
          </Card>
        ) : (
          <View style={{ gap: theme.spacing.md }}>
            {filteredRequests.map((request) => (
              <RequestItem
                key={request._id}
                request={request}
                type="excuse"
                onPress={() => handleRequestPress(request)}
                theme={theme}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* New Request Button */}
      <View style={{ padding: theme.spacing.lg }}>
        <Button
          title="New Excuse Request"
          onPress={handleNewRequest}
          variant="primary"
          icon="add"
        />
      </View>
    </View>
  );
};

export default ExcuseRequestScreen;