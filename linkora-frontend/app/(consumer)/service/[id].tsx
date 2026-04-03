import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  TextInput,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getService, getServiceReviews, getServiceRating, submitServiceReview } from "../../../lib/services";
import { createBooking, getMyBookings, type BookingRow } from "../../../lib/bookings";
import { getImageUrl } from "../../../lib/config";
import { useAuth } from "../../../context/AuthContext";
import RatingStars from "../../../components/RatingStars";

const WIDTH = Dimensions.get("window").width;

export default function ConsumerServiceDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [myBooking, setMyBooking] = useState<BookingRow | null>(null);
  const [svc, setSvc] = useState<any>(null);
  const [rating, setRating] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Payment states
  const [paymentMode, setPaymentMode] = useState<"now" | "later" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | null>(null);
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;

      try {
        const data = await getService(Number(id));
        if (!cancelled) setSvc(data);

        try {
          const bookings = await getMyBookings();
          const existing = bookings.find(
            (b) => Number(b.service) === Number(id)
          );
          if (!cancelled) setMyBooking(existing || null);
        } catch {
          if (!cancelled) setMyBooking(null);
        }

        const ratingData = await getServiceRating(Number(id));
        if (!cancelled) setRating(ratingData);

        const reviewsData = await getServiceReviews(Number(id));
        if (!cancelled) setReviews(reviewsData);
      } catch {
        if (!cancelled) setSvc(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onBook(paymentMethod?: string, paymentStatus?: string) {
    if (!svc?.id) return;

    try {
      setBooking(true);
      await createBooking(svc.id, paymentMethod, paymentStatus);
      setMyBooking({
        id: -1,
        service: svc.id,
        service_title: svc.title,
        provider_business_name: svc.provider_business_name,
        consumer_email: user?.email ?? "",
        status: "pending",
        scheduled_date: "",
        scheduled_time: "",
      });
      Alert.alert("Booked", "Your booking request was sent.", [
        {
          text: "OK",
          onPress: () => router.replace("/(consumer)/bookings"),
        },
      ]);
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.non_field_errors?.[0] ||
        "Could not create booking.";
      Alert.alert("Booking failed", String(msg));
    } finally {
      setBooking(false);
    }
  }

  function handleBookLater() {
    onBook("cod", "pending");
  }

  function handlePayNow() {
    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        Alert.alert("Error", "Please enter UPI ID");
        return;
      }
      onBook("upi", "paid");
    } else if (paymentMethod === "card") {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        Alert.alert("Error", "Please fill all card details");
        return;
      }
      onBook("card", "paid");
    } else {
      Alert.alert("Error", "Please select payment method");
    }
  }

  async function onSubmitReview() {
    if (newRating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      await submitServiceReview(Number(id), newRating, newComment);

      const ratingData = await getServiceRating(Number(id));
      setRating(ratingData);

      const reviewsData = await getServiceReviews(Number(id));
      setReviews(reviewsData);

      Alert.alert("Success", "Review submitted successfully");
      setShowReviewModal(false);
      setNewRating(0);
      setNewComment("");
    } catch {
      Alert.alert("Error", "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <LinearGradient
        colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
        style={styles.centerContainer}
      >
        <ActivityIndicator size="large" color="#22C55E" />
      </LinearGradient>
    );
  }

  if (!svc) {
    return (
      <LinearGradient
        colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
        style={styles.centerContainer}
      >
        <Text style={styles.errorText}>Service not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0B0B0F", "#0F172A", "#0B0B0F"]}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Service Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* IMAGE CAROUSEL */}
        {svc.images && svc.images.length > 0 && (
          <View style={styles.carouselContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
            >
              {svc.images.map((img: any, index: number) => (
                <Image
                  key={index}
                  source={{
                    uri: getImageUrl(img.image) + `?t=${Date.now()}`,
                  }}
                  style={styles.carouselImage}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* SERVICE INFO CARD */}
        <View style={styles.infoCard}>
          {/* Title */}
          <Text style={styles.serviceTitle}>{svc.title}</Text>

          {/* Category & Provider Row */}
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{svc.category}</Text>
            </View>
            {svc.provider_business_name && (
              <Text style={styles.providerName}>{svc.provider_business_name}</Text>
            )}
          </View>

          {/* Price Highlight */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>₹ {svc.price}</Text>
          </View>

          {/* Duration */}
          <View style={styles.durationRow}>
            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
            <Text style={styles.durationText}>{svc.duration_minutes} minutes</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{svc.description}</Text>
        </View>

        {/* RATING SECTION */}
        {rating && (
          <View style={styles.ratingCard}>
            <View style={styles.ratingContent}>
              <Text style={styles.ratingNumber}>{rating.average_rating}</Text>
              <View style={styles.starsAndCount}>
                <RatingStars rating={Math.round(rating.average_rating)} size={16} />
                <Text style={styles.reviewCountText}>
                  ({rating.total_reviews} {rating.total_reviews === 1 ? "review" : "reviews"})
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* REVIEWS SECTION */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>Reviews</Text>

          {reviews.length === 0 ? (
            <View style={styles.emptyReviewsCard}>
              <Ionicons name="star-outline" size={40} color="#9CA3AF" />
              <Text style={styles.emptyReviewsText}>No reviews yet</Text>
              <Text style={styles.emptyReviewsSubtext}>Be the first to share your experience</Text>
            </View>
          ) : (
            <View style={styles.reviewsList}>
              {reviews.map((review: any, index: number) => (
                <View key={index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                      <Text style={styles.reviewUsername}>{review.user_name}</Text>
                      <RatingStars rating={review.rating} size={14} />
                    </View>
                    <Text style={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                  {review.comment && (
                    <Text style={styles.reviewCommentText}>{review.comment}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* BOTTOM SPACING */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ACTION BUTTONS */}
      <View style={styles.actionButtonsContainer}>
        <View style={styles.topButtonsRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => setShowReviewModal(true)}
          >
            <Ionicons name="create-outline" size={18} color="#FFF" />
            <Text style={styles.secondaryButtonText}>Write Review</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              if (svc?.lat && svc?.lng) {
                router.push({
                  pathname: "/(consumer)/map",
                  params: {
                    lat: svc.lat,
                    lng: svc.lng,
                    title: svc.title,
                  },
                });
              }
            }}
          >
            <Ionicons name="map-outline" size={18} color="#FFF" />
            <Text style={styles.secondaryButtonText}>View on Map</Text>
          </Pressable>
        </View>

        {myBooking && myBooking.status !== "cancelled" ? (
          <Pressable
            style={[
              styles.bookButton,
              styles.bookButtonDisabled,
            ]}
            disabled
          >
            <Text style={styles.bookButtonText}>
              {myBooking.status === "pending" && "Pending Approval"}
              {myBooking.status === "accepted" && "Accepted"}
              {myBooking.status === "completed" && "Completed"}
            </Text>
          </Pressable>
        ) : svc?.payment_type === "pay_later" ? (
          <Pressable
            style={[styles.bookButton, booking && styles.bookButtonDisabled]}
            onPress={handleBookLater}
            disabled={booking}
          >
            {booking ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <>
                <Ionicons name="calendar-outline" size={18} color="#000" />
                <Text style={styles.bookButtonText}>Book & Pay Later</Text>
              </>
            )}
          </Pressable>
        ) : svc?.payment_type === "pay_now" ? (
          <View style={styles.paymentContainer}>
            <View style={styles.paymentMethodSelector}>
              <Pressable
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === "upi" && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setPaymentMethod("upi")}
              >
                <Ionicons name="phone-portrait-outline" size={20} color={paymentMethod === "upi" ? "#000" : "#FFF"} />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === "upi" && styles.paymentMethodTextActive,
                ]}>UPI</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === "card" && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setPaymentMethod("card")}
              >
                <Ionicons name="card-outline" size={20} color={paymentMethod === "card" ? "#000" : "#FFF"} />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === "card" && styles.paymentMethodTextActive,
                ]}>Card</Text>
              </Pressable>
            </View>
            {paymentMethod === "upi" && (
              <View style={styles.paymentInputs}>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="Enter UPI ID"
                  placeholderTextColor="#6B7280"
                  value={upiId}
                  onChangeText={setUpiId}
                />
                <Pressable
                  style={[styles.payButton, booking && styles.bookButtonDisabled]}
                  onPress={handlePayNow}
                  disabled={booking}
                >
                  {booking ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : (
                    <Text style={styles.payButtonText}>Pay & Book</Text>
                  )}
                </Pressable>
              </View>
            )}
            {paymentMethod === "card" && (
              <View style={styles.paymentInputs}>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="Card Number"
                  placeholderTextColor="#6B7280"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                />
                <View style={styles.cardRow}>
                  <TextInput
                    style={[styles.paymentInput, styles.cardInputHalf]}
                    placeholder="MM/YY"
                    placeholderTextColor="#6B7280"
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                  />
                  <TextInput
                    style={[styles.paymentInput, styles.cardInputHalf]}
                    placeholder="CVV"
                    placeholderTextColor="#6B7280"
                    value={cardCvv}
                    onChangeText={setCardCvv}
                    keyboardType="numeric"
                    secureTextEntry
                  />
                </View>
                <Pressable
                  style={[styles.payButton, booking && styles.bookButtonDisabled]}
                  onPress={handlePayNow}
                  disabled={booking}
                >
                  {booking ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : (
                    <Text style={styles.payButtonText}>Pay & Book</Text>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        ) : svc?.payment_type === "both" ? (
          <View style={styles.paymentContainer}>
            <View style={styles.paymentModeSelector}>
              <Pressable
                style={[
                  styles.paymentModeButton,
                  paymentMode === "later" && styles.paymentModeButtonActive,
                ]}
                onPress={() => setPaymentMode("later")}
              >
                <Text style={[
                  styles.paymentModeText,
                  paymentMode === "later" && styles.paymentModeTextActive,
                ]}>Pay Later</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.paymentModeButton,
                  paymentMode === "now" && styles.paymentModeButtonActive,
                ]}
                onPress={() => setPaymentMode("now")}
              >
                <Text style={[
                  styles.paymentModeText,
                  paymentMode === "now" && styles.paymentModeTextActive,
                ]}>Pay Now</Text>
              </Pressable>
            </View>
            {paymentMode === "later" && (
              <Pressable
                style={[styles.bookButton, booking && styles.bookButtonDisabled]}
                onPress={handleBookLater}
                disabled={booking}
              >
                {booking ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <>
                    <Ionicons name="calendar-outline" size={18} color="#000" />
                    <Text style={styles.bookButtonText}>Book & Pay Later</Text>
                  </>
                )}
              </Pressable>
            )}
            {paymentMode === "now" && (
              <>
                <View style={styles.paymentMethodSelector}>
                  <Pressable
                    style={[
                      styles.paymentMethodButton,
                      paymentMethod === "upi" && styles.paymentMethodButtonActive,
                    ]}
                    onPress={() => setPaymentMethod("upi")}
                  >
                    <Ionicons name="phone-portrait-outline" size={20} color={paymentMethod === "upi" ? "#000" : "#FFF"} />
                    <Text style={[
                      styles.paymentMethodText,
                      paymentMethod === "upi" && styles.paymentMethodTextActive,
                    ]}>UPI</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.paymentMethodButton,
                      paymentMethod === "card" && styles.paymentMethodButtonActive,
                    ]}
                    onPress={() => setPaymentMethod("card")}
                  >
                    <Ionicons name="card-outline" size={20} color={paymentMethod === "card" ? "#000" : "#FFF"} />
                    <Text style={[
                      styles.paymentMethodText,
                      paymentMethod === "card" && styles.paymentMethodTextActive,
                    ]}>Card</Text>
                  </Pressable>
                </View>
                {paymentMethod === "upi" && (
                  <View style={styles.paymentInputs}>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="Enter UPI ID"
                      placeholderTextColor="#6B7280"
                      value={upiId}
                      onChangeText={setUpiId}
                    />
                    <Pressable
                      style={[styles.payButton, booking && styles.bookButtonDisabled]}
                      onPress={handlePayNow}
                      disabled={booking}
                    >
                      {booking ? (
                        <ActivityIndicator color="#000" size="small" />
                      ) : (
                        <Text style={styles.payButtonText}>Pay & Book</Text>
                      )}
                    </Pressable>
                  </View>
                )}
                {paymentMethod === "card" && (
                  <View style={styles.paymentInputs}>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="Card Number"
                      placeholderTextColor="#6B7280"
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      keyboardType="numeric"
                    />
                    <View style={styles.cardRow}>
                      <TextInput
                        style={[styles.paymentInput, styles.cardInputHalf]}
                        placeholder="MM/YY"
                        placeholderTextColor="#6B7280"
                        value={cardExpiry}
                        onChangeText={setCardExpiry}
                      />
                      <TextInput
                        style={[styles.paymentInput, styles.cardInputHalf]}
                        placeholder="CVV"
                        placeholderTextColor="#6B7280"
                        value={cardCvv}
                        onChangeText={setCardCvv}
                        keyboardType="numeric"
                        secureTextEntry
                      />
                    </View>
                    <Pressable
                      style={[styles.payButton, booking && styles.bookButtonDisabled]}
                      onPress={handlePayNow}
                      disabled={booking}
                    >
                      {booking ? (
                        <ActivityIndicator color="#000" size="small" />
                      ) : (
                        <Text style={styles.payButtonText}>Pay & Book</Text>
                      )}
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          <Pressable
            style={[styles.bookButton, booking && styles.bookButtonDisabled]}
            onPress={handleBookLater}
            disabled={booking}
          >
            {booking ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <>
                <Ionicons name="calendar-outline" size={18} color="#000" />
                <Text style={styles.bookButtonText}>{myBooking ? "Book Again" : "Book Now"}</Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {/* REVIEW MODAL */}
      <Modal visible={showReviewModal} animationType="slide" transparent>
        <LinearGradient
          colors={["#0B0B0F", "#12121A", "#0B0B0F"]}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowReviewModal(false)}>
              <Ionicons name="close" size={24} color="#FFF" />
            </Pressable>
            <Text style={styles.modalTitle}>Your Review</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
          >
            <Text style={styles.modalSectionTitle}>Rating</Text>
            <View style={styles.ratingSelector}>
              <RatingStars
                rating={newRating}
                onRatingChange={setNewRating}
                size={40}
                interactive
              />
            </View>

            <Text style={styles.modalSectionTitle}>Comment (Optional)</Text>
            <TextInput
              style={styles.reviewTextInput}
              placeholder="Share your experience with this service..."
              placeholderTextColor="#6B7280"
              value={newComment}
              onChangeText={setNewComment}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <Pressable
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={onSubmitReview}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Review</Text>
              )}
            </Pressable>
          </ScrollView>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // MAIN CONTAINER
  container: {
    flex: 1,
    paddingTop: 16,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  errorText: {
    color: "#9CA3AF",
    fontSize: 16,
    marginBottom: 20,
  },

  backLink: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },

  backLinkText: {
    color: "#22C55E",
    fontWeight: "600",
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },

  // IMAGE CAROUSEL
  carouselContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },

  carouselImage: {
    width: WIDTH - 32,
    height: 240,
    borderRadius: 16,
  },

  // SERVICE INFO CARD
  infoCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },

  serviceTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 12,
    lineHeight: 32,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },

  categoryBadge: {
    backgroundColor: "#1F2937",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  categoryText: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
  },

  providerName: {
    color: "#D1D5DB",
    fontSize: 13,
    flex: 1,
  },

  priceSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },

  priceLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },

  price: {
    fontSize: 32,
    fontWeight: "700",
    color: "#22C55E",
  },

  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },

  durationText: {
    color: "#D1D5DB",
    fontSize: 14,
  },

  description: {
    color: "#E5E7EB",
    fontSize: 15,
    lineHeight: 22,
  },

  // RATING CARD
  ratingCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },

  ratingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  ratingNumber: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FBBF24",
  },

  starsAndCount: {
    flex: 1,
    gap: 8,
  },

  reviewCountText: {
    color: "#9CA3AF",
    fontSize: 13,
  },

  // REVIEWS SECTION
  reviewsContainer: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 16,
  },

  emptyReviewsCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },

  emptyReviewsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D1D5DB",
    marginTop: 12,
  },

  emptyReviewsSubtext: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 6,
  },

  reviewsList: {
    gap: 12,
  },

  reviewCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 14,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  reviewUserInfo: {
    flex: 1,
    gap: 6,
  },

  reviewUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },

  reviewDate: {
    fontSize: 12,
    color: "#6B7280",
  },

  reviewCommentText: {
    fontSize: 13,
    color: "#D1D5DB",
    lineHeight: 18,
  },

  bottomSpacer: {
    height: 40,
  },

  // ACTION BUTTONS
  actionButtonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(11, 11, 15, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    paddingBottom: 20,
  },

  writeReviewButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  writeReviewButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },

  bookButton: {
    backgroundColor: "#22C55E",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  bookButtonDisabled: {
    opacity: 0.6,
  },

  bookButtonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },

  // MODAL
  modalContainer: {
    flex: 1,
    paddingTop: 16,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
  },

  modalScroll: {
    flex: 1,
  },

  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },

  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
    marginTop: 20,
  },

  ratingSelector: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: "#111827",
    borderRadius: 12,
  },

  reviewTextInput: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 14,
    color: "#FFF",
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 20,
  },

  submitButton: {
    backgroundColor: "#22C55E",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  // PAYMENT STYLES
  paymentContainer: {
    flex: 1,
    gap: 16,
  },

  paymentModeSelector: {
    flexDirection: "row",
    gap: 12,
  },

  paymentModeButton: {
    flex: 1,
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  paymentModeButtonActive: {
    backgroundColor: "#22C55E",
  },

  paymentModeText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  paymentModeTextActive: {
    color: "#000",
  },

  paymentMethodSelector: {
    flexDirection: "row",
    gap: 12,
  },

  paymentMethodButton: {
    flex: 1,
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  paymentMethodButtonActive: {
    backgroundColor: "#22C55E",
  },

  paymentMethodText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  paymentMethodTextActive: {
    color: "#000",
  },

  paymentInputs: {
    gap: 12,
  },

  paymentInput: {
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFF",
    fontSize: 16,
  },

  cardRow: {
    flexDirection: "row",
    gap: 12,
  },

  cardInputHalf: {
    flex: 1,
  },

  payButton: {
    backgroundColor: "#22C55E",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },

  payButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  // NEW: Map and review buttons
  topButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  secondaryButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
