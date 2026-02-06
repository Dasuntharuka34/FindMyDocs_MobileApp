import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RequestItem from '../../components/RequestItem';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';

const AllRequestsScreen = () => {
    const { user } = useAuth();
    const { excuseRequests, leaveRequests, letters, isLoading, fetchAllSystemRequests } = useRequests();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user?.role === 'Admin') {
            fetchAllSystemRequests();
        }
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAllSystemRequests();
        setRefreshing(false);
    };

    const handleRequestPress = (request) => {
        navigation.navigate('RequestDetail', {
            requestId: request._id,
            type: request.type,
        });
    };

    const getFilteredRequests = () => {
        let baseRequests;
        switch (activeTab) {
            case 'excuse':
                baseRequests = excuseRequests.map(req => ({ ...req, type: 'excuse' }));
                break;
            case 'leave':
                baseRequests = leaveRequests.map(req => ({ ...req, type: 'leave' }));
                break;
            case 'letter':
                baseRequests = letters.map(req => ({ ...req, type: 'letter' }));
                break;
            default:
                baseRequests = [
                    ...excuseRequests.map(req => ({ ...req, type: 'excuse' })),
                    ...leaveRequests.map(req => ({ ...req, type: 'leave' })),
                    ...letters.map(req => ({ ...req, type: 'letter' }))
                ].sort((a, b) => new Date(b.submittedDate || b.createdAt) - new Date(a.submittedDate || a.createdAt));
                break;
        }

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            return baseRequests.filter(req => {
                const studentName = (req.studentName || req.student || '').toLowerCase();
                const reason = (req.reason || '').toLowerCase();
                const type = (req.type || '').toLowerCase();
                const status = (req.status || '').toLowerCase();

                return (
                    studentName.includes(lowercasedQuery) ||
                    reason.includes(lowercasedQuery) ||
                    type.includes(lowercasedQuery) ||
                    status.includes(lowercasedQuery)
                );
            });
        }

        return baseRequests;
    };

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'excuse', label: 'Excuse' },
        { id: 'leave', label: 'Leave' },
        { id: 'letter', label: 'Letters' }
    ];

    const requests = getFilteredRequests();

    const styles = {
        container: {
            ...commonStyles.container(theme),
            padding: theme.spacing.md,
        },
        header: {
            ...commonStyles.text(theme, 'primary', 'xl'),
            fontWeight: 'bold',
            marginBottom: theme.spacing.md,
            marginTop: theme.spacing.lg,
            textAlign: 'center',
        },
        searchInput: {
            ...commonStyles.input(theme),
            marginBottom: theme.spacing.md,
        },
        tabContainer: {
            flexDirection: 'row',
            marginBottom: theme.spacing.md,
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.xs,
        },
        tab: {
            flex: 1,
            padding: theme.spacing.sm,
            alignItems: 'center',
            borderRadius: theme.borderRadius.lg,
        },
        activeTab: {
            backgroundColor: theme.colors.primary,
        },
        tabText: {
            ...commonStyles.text(theme, 'secondary', 'sm'),
            fontWeight: '500',
        },
        activeTabText: {
            color: theme.colors.textInverse,
        },
        emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing.xl,
        },
        emptyText: {
            ...commonStyles.text(theme, 'secondary', 'md'),
            textAlign: 'center',
        },
        countText: {
            ...commonStyles.text(theme, 'tertiary', 'sm'),
            marginBottom: theme.spacing.md,
            textAlign: 'center',
        },
    };

    if (isLoading && !refreshing) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Text style={styles.header}>All Student Requests</Text>

            <TextInput
                style={styles.searchInput}
                placeholder="Search by student, reason, or status..."
                placeholderTextColor={theme.colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[
                            styles.tab,
                            activeTab === tab.id && styles.activeTab
                        ]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab.id && styles.activeTabText
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.countText}>
                {searchQuery
                    ? `Found ${requests.length} matching requests`
                    : `Showing ${requests.length} ${activeTab === 'all' ? 'total' : activeTab} requests`}
            </Text>

            <FlatList
                data={requests}
                renderItem={({ item }) => (
                    <RequestItem
                        request={item}
                        type={item.type}
                        onPress={() => handleRequestPress(item)}
                    />
                )}
                keyExtractor={(item) => `${item.type}-${item._id}`}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No {activeTab === 'all' ? '' : activeTab + ' '}requests found
                        </Text>
                    </View>
                }
            />
        </KeyboardAvoidingView>
    );
};

export default AllRequestsScreen;
